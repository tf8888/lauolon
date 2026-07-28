"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";

import { ConversationEmptyState } from "@/components/ai-elements/conversation";
import { AISettingsDialog } from "@/components/dashboard/ai-chat/settings/dialog";
import { Button } from "@/components/ui/button";
import { LauolonIcon } from "@/components/ui/logos/lauolon-icon";

export function DisabledState() {
  const [openAISettings, setOpenAISettings] = useState(false);

  return (
    <div className="p-4 text-center">
      <ConversationEmptyState
        icon={<LauolonIcon width={64} className="opacity-25" />}
        title="Lauolon AI Advisor"
        description="Share your portfolio and financial profile to get tailored insights and advice."
        className="p-0 pb-3"
      />
      <p className="text-muted-foreground mb-2 text-sm">
        Turn on AI data sharing in settings to unlock personalized answers.
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpenAISettings(true)}
      >
        <Sparkles /> Enable AI Advisor
      </Button>
      <AISettingsDialog
        open={openAISettings}
        onOpenChange={setOpenAISettings}
      />
    </div>
  );
}
