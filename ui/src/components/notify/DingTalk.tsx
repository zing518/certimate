import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { getErrMessage } from "@/lib/error";
import { NotifyChannelDingTalk, NotifyChannels } from "@/domain/settings";
import { useNotify } from "@/providers/notify";
import { update } from "@/repository/settings";

type DingTalkSetting = {
  id: string;
  name: string;
  data: NotifyChannelDingTalk;
};

const DingTalk = () => {
  const { config, setChannels } = useNotify();
  const { t } = useTranslation();

  const [dingtalk, setDingtalk] = useState<DingTalkSetting>({
    id: config.id ?? "",
    name: "notifyChannels",
    data: {
      accessToken: "",
      secret: "",
      enabled: false,
    },
  });

  useEffect(() => {
    const getDetailDingTalk = () => {
      const df: NotifyChannelDingTalk = {
        accessToken: "",
        secret: "",
        enabled: false,
      };
      if (!config.content) {
        return df;
      }
      const chanels = config.content as NotifyChannels;
      if (!chanels.dingtalk) {
        return df;
      }

      return chanels.dingtalk as NotifyChannelDingTalk;
    };
    const data = getDetailDingTalk();
    setDingtalk({
      id: config.id ?? "",
      name: "dingtalk",
      data,
    });
  }, [config]);

  const { toast } = useToast();

  const handleSaveClick = async () => {
    try {
      const resp = await update({
        ...config,
        name: "notifyChannels",
        content: {
          ...config.content,
          dingtalk: {
            ...dingtalk.data,
          },
        },
      });

      setChannels(resp);
      toast({
        title: t("common.save.succeeded.message"),
        description: t("settings.notification.config.saved.message"),
      });
    } catch (e) {
      const msg = getErrMessage(e);

      toast({
        title: t("common.save.failed.message"),
        description: `${t("settings.notification.config.failed.message")}: ${msg}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <Input
        placeholder="AccessToken"
        value={dingtalk.data.accessToken}
        onChange={(e) => {
          setDingtalk({
            ...dingtalk,
            data: {
              ...dingtalk.data,
              accessToken: e.target.value,
            },
          });
        }}
      />
      <Input
        placeholder={t("settings.notification.dingtalk.secret.placeholder")}
        className="mt-2"
        value={dingtalk.data.secret}
        onChange={(e) => {
          setDingtalk({
            ...dingtalk,
            data: {
              ...dingtalk.data,
              secret: e.target.value,
            },
          });
        }}
      />
      <div className="flex items-center space-x-1 mt-2">
        <Switch
          id="airplane-mode"
          checked={dingtalk.data.enabled}
          onCheckedChange={() => {
            setDingtalk({
              ...dingtalk,
              data: {
                ...dingtalk.data,
                enabled: !dingtalk.data.enabled,
              },
            });
          }}
        />
        <Label htmlFor="airplane-mode">{t("settings.notification.config.enable")}</Label>
      </div>

      <div className="flex justify-end mt-2">
        <Button
          onClick={() => {
            handleSaveClick();
          }}
        >
          {t("common.save")}
        </Button>
      </div>
    </div>
  );
};

export default DingTalk;
