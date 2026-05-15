export async function sendTeamsNotification(webhookUrl: string, title: string, message: string, url?: string) {
  if (!webhookUrl) return;

  const payload = {
    "@type": "MessageCard",
    "@context": "http://schema.org/extensions",
    "themeColor": "4F46E5",
    "summary": title,
    "sections": [{
      "activityTitle": title,
      "activitySubtitle": "AtomSync Portal Notification",
      "text": message,
      "markdown": true
    }],
    ...(url && {
      "potentialAction": [{
        "@type": "OpenUri",
        "name": "View in Portal",
        "targets": [{ "os": "default", "uri": url }]
      }]
    })
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
