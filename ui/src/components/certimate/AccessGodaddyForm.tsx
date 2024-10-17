import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClientResponseError } from "pocketbase";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PbErrorData } from "@/domain/base";
import { Access, accessFormType, getUsageByConfigType, GodaddyConfig } from "@/domain/access";
import { save } from "@/repository/access";
import { useConfig } from "@/providers/config";

type AccessGodaddyFormProps = {
  op: "add" | "edit" | "copy";
  data?: Access;
  onAfterReq: () => void;
};

const AccessGodaddyForm = ({ data, op, onAfterReq }: AccessGodaddyFormProps) => {
  const { addAccess, updateAccess } = useConfig();
  const { t } = useTranslation();
  const formSchema = z.object({
    id: z.string().optional(),
    name: z
      .string()
      .min(1, "access.authorization.form.name.placeholder")
      .max(64, t("common.errmsg.string_max", { max: 64 })),
    configType: accessFormType,
    apiKey: z
      .string()
      .min(1, "access.authorization.form.godaddy_api_key.placeholder")
      .max(64, t("common.errmsg.string_max", { max: 64 })),
    apiSecret: z
      .string()
      .min(1, "access.authorization.form.godaddy_api_secret.placeholder")
      .max(64, t("common.errmsg.string_max", { max: 64 })),
  });

  let config: GodaddyConfig = {
    apiKey: "",
    apiSecret: "",
  };
  if (data) config = data.config as GodaddyConfig;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id,
      name: data?.name || "",
      configType: "godaddy",
      apiKey: config.apiKey,
      apiSecret: config.apiSecret,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const req: Access = {
      id: data.id as string,
      name: data.name,
      configType: data.configType,
      usage: getUsageByConfigType(data.configType),
      config: {
        apiKey: data.apiKey,
        apiSecret: data.apiSecret,
      },
    };

    try {
      req.id = op == "copy" ? "" : req.id;
      const rs = await save(req);

      onAfterReq();

      req.id = rs.id;
      req.created = rs.created;
      req.updated = rs.updated;
      if (data.id && op == "edit") {
        updateAccess(req);
        return;
      }
      addAccess(req);
    } catch (e) {
      const err = e as ClientResponseError;

      Object.entries(err.response.data as PbErrorData).forEach(([key, value]) => {
        form.setError(key as keyof z.infer<typeof formSchema>, {
          type: "manual",
          message: value.message,
        });
      });
    }
  };

  return (
    <>
      <div className="max-w-[35em] mx-auto mt-10">
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.stopPropagation();
              form.handleSubmit(onSubmit)(e);
            }}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("access.authorization.form.name.label")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("access.authorization.form.name.placeholder")} {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormLabel>{t("access.authorization.form.config.label")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="configType"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormLabel>{t("access.authorization.form.config.label")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("access.authorization.form.godaddy_api_key.label")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("access.authorization.form.godaddy_api_key.placeholder")} {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="apiSecret"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("access.authorization.form.godaddy_api_secret.label")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("access.authorization.form.godaddy_api_secret.placeholder")} {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit">{t("common.save")}</Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default AccessGodaddyForm;
