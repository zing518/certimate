import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getErrMessage } from "@/lib/error";
import { getPb } from "@/repository/api";

const formSchema = z.object({
  username: z.string().email({
    message: "login.username.errmsg.invalid",
  }),
  password: z.string().min(10, {
    message: "login.password.errmsg.invalid",
  }),
});

const Login = () => {
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await getPb().admins.authWithPassword(values.username, values.password);
      navigage("/");
    } catch (e) {
      const message = getErrMessage(e);
      form.setError("username", { message });
      form.setError("password", { message });
    }
  };

  const navigage = useNavigate();
  return (
    <div className="max-w-[35em] border dark:border-stone-500 mx-auto mt-32 p-10 rounded-md shadow-md">
      <div className="flex justify-center mb-10">
        <img src="/vite.svg" className="w-16" />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 dark:text-stone-200">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("login.username.label")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("login.username.placeholder")} {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("login.password.label")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("login.password.placeholder")} {...field} type="password" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit">{t("login.submit")}</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Login;
