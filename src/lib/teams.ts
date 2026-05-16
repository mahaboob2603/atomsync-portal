const PORTAL_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://atomsync-portal.vercel.app";

export function getDeepLink(path: string): string {
  return `${PORTAL_BASE_URL}${path}`;
}

export async function sendTeamsNotification(
  webhookUrl: string,
  title: string,
  message: string,
  deepLinkUrl?: string
) {
  if (!webhookUrl) return;

  // Adaptive Card payload (modern Teams format)
  const payload = {
    type: "message",
    attachments: [
      {
        contentType: "application/vnd.microsoft.card.adaptive",
        contentUrl: null,
        content: {
          $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
          type: "AdaptiveCard",
          version: "1.4",
          body: [
            {
              type: "ColumnSet",
              columns: [
                {
                  type: "Column",
                  width: "auto",
                  items: [
                    {
                      type: "Image",
                      url: "https://img.icons8.com/fluency/48/goal.png",
                      size: "Small",
                      style: "Person",
                    },
                  ],
                },
                {
                  type: "Column",
                  width: "stretch",
                  items: [
                    {
                      type: "TextBlock",
                      text: "AtomQuest Portal",
                      weight: "Bolder",
                      size: "Small",
                      color: "Accent",
                    },
                    {
                      type: "TextBlock",
                      text: title,
                      weight: "Bolder",
                      size: "Medium",
                      wrap: true,
                    },
                  ],
                },
              ],
            },
            {
              type: "TextBlock",
              text: message,
              wrap: true,
              spacing: "Medium",
            },
            {
              type: "TextBlock",
              text: `📅 ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`,
              size: "Small",
              color: "Light",
              spacing: "Small",
            },
          ],
          ...(deepLinkUrl && {
            actions: [
              {
                type: "Action.OpenUrl",
                title: "🔗 Open in Portal",
                url: deepLinkUrl,
              },
            ],
          }),
        },
      },
    ],
  };

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("Failed to send Teams notification:", error);
  }
}
