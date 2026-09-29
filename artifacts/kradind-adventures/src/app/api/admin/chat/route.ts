import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import {
  getChatChannelsAsync,
  getChatMessagesAsync,
  saveChatMessageAsync,
  toggleChatReactionAsync,
  getAdminUsersAsync,
  getCustomersAsync,
  AdminRole,
} from "@/lib/cms-store";

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession(request);
    if (!session.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const channelId = searchParams.get("channelId") || "general";
    const userRole = (session.user?.role as AdminRole) || "Super Admin";

    // 1. Get channels and filter according to user role permissions
    const allChannels = await getChatChannelsAsync();
    const accessibleChannels = allChannels.filter((c) => {
      if (!c.allowedRoles || c.allowedRoles.length === 0) return true;
      if (userRole === "Super Admin") return true;
      return c.allowedRoles.includes(userRole);
    });

    // 2. Fetch messages
    const messages = await getChatMessagesAsync(channelId);

    // 3. Fetch team members for direct messaging
    const allAdmins = await getAdminUsersAsync();
    const teamMembers = allAdmins
      .filter((a) => a.status !== "Suspended")
      .map((a) => ({
        id: a.id,
        name: a.name,
        email: a.email,
        role: a.role || "Sales / CRM Agent",
        department: a.department || "Operations",
        phone: a.phone || "",
        online: true,
      }));

    // 4. Fetch lightweight customer references for tagging
    const customers = await getCustomersAsync();
    const customerTags = customers.slice(0, 30).map((c) => ({
      id: c.id,
      name: c.name,
      phone: c.phone,
      lifecycleStage: c.lifecycleStage,
    }));

    return NextResponse.json({
      channels: accessibleChannels,
      messages,
      teamMembers,
      customerTags,
      currentUser: {
        id: session.user?.id || "admin",
        name: session.user?.name || "Admin",
        email: session.user?.email || "admin@kradind.com",
        role: userRole,
      },
    });
  } catch (error) {
    console.error("Team Chat GET error:", error);
    return NextResponse.json({ error: "Failed to fetch chat data" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession(request);
    if (!session.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const userRole = (body.senderRole as AdminRole) || (session.user?.role as AdminRole) || "Super Admin";
    const userName = body.senderName || session.user?.name || "Staff Member";
    const userId = body.senderId || session.user?.id || `user-${Date.now().toString().slice(-4)}`;

    // Handle reaction toggle
    if (body.action === "react") {
      if (!body.messageId || !body.emoji) {
        return NextResponse.json({ error: "messageId and emoji are required" }, { status: 400 });
      }
      const updated = await toggleChatReactionAsync(body.messageId, body.emoji, userName);
      return NextResponse.json(updated);
    }

    // Handle multi-agent dialogue dispatch (conversations between multiple agents)
    if (body.action === "multi_agent_dialogue" && Array.isArray(body.dialogue)) {
      const savedMessages = [];
      for (const item of body.dialogue) {
        const msg = await saveChatMessageAsync({
          channelId: item.channelId || body.channelId || "general",
          senderId: item.senderId || `agent-${Date.now()}`,
          senderName: item.senderName,
          senderRole: item.senderRole,
          content: item.content.trim(),
          taggedCustomerId: item.taggedCustomerId || undefined,
          taggedCustomerName: item.taggedCustomerName || undefined,
          isUrgent: Boolean(item.isUrgent),
          reactions: item.reactions || {},
        });
        savedMessages.push(msg);
      }
      return NextResponse.json(savedMessages, { status: 201 });
    }

    // Default action: Send message
    if (!body.content || !body.channelId) {
      return NextResponse.json({ error: "channelId and content are required" }, { status: 400 });
    }

    const savedMessage = await saveChatMessageAsync({
      channelId: body.channelId,
      senderId: userId,
      senderName: userName,
      senderRole: userRole,
      content: body.content.trim(),
      taggedCustomerId: body.taggedCustomerId || undefined,
      taggedCustomerName: body.taggedCustomerName || undefined,
      isUrgent: Boolean(body.isUrgent),
      reactions: {},
    });

    return NextResponse.json(savedMessage, { status: 201 });
  } catch (error) {
    console.error("Team Chat POST error:", error);
    return NextResponse.json({ error: "Failed to post message" }, { status: 500 });
  }
}
