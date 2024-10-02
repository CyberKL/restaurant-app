import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { LoginFormSchema, createLoginSchema } from "@/validations/loginSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { authenticateUser } from "@/api/api";
import { useDispatch } from "react-redux";
import { login } from "@/features/auth/authSlice";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Login() {
  const [error, setError] = useState<boolean>(false);
  const [isInvalidCreds, setIsInvalidCreds] = useState<boolean>(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [t, i18n] = useTranslation();

  const loginSchema = createLoginSchema(t); // The schema is generated based on the language to return correct errors

  const form = useForm<LoginFormSchema>({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormSchema) => {
    const response = await authenticateUser(data);

    if (response) {
      if (response === "User not found") {
        setIsInvalidCreds(true);
      } else { // Successful login
        dispatch(login(response));
        navigate("/");
      }
    } else {
      setError(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="relative grid grid-cols-12">
      {/* Back button with aria-label for screen readers */}
      <div className={`absolute top-0 p-5 ${i18n.language === 'ar' ? 'right-0' : 'left-0'}`}>
        <Link to={"/"} aria-label={t('login.back')}>
          <Button
            variant={"ghost"}
            size={"icon"}
            className="hover:scale-110 transition"
          >
            <ChevronLeft color="#16a34a" />
          </Button>
        </Link>
      </div>

      {/* Form Section */}
      <div className="sm:col-span-6 col-span-full flex flex-col items-center justify-center gap-20 p-10">
        <h1 className="font-bold text-3xl" role="heading" aria-level={1}>{t('login.title')}</h1>
        <div className="w-full flex flex-col items-center justify-center space-y-3">
          {/* Invalid credentials message */}
          <p
            className={`text-red-500 ${isInvalidCreds ? "visible" : "invisible"}`}
            role="alert"
            aria-live="assertive"
          >
            {t('login.invalid')}
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 sm:max-w-lg max-w-sm w-full"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('login.email')}</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" aria-required="true" />
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
                    <FormLabel>{t('login.password')}</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" aria-required="true" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-green-600 col-span-full"
                aria-label={t('login.submit')}
              >
                {t('login.submit')}
              </Button>
            </form>
          </Form>
        </div>
        <p className="text-sm">
          {t('login.register.text')}{" "}
          <Link
            to={"/register"}
            className="text-green-600 underline italic font-semibold"
            aria-label={t('login.register.link')}
          >
            {t('login.register.link')}
          </Link>
        </p>
      </div>

      {/* Image Section */}
      <div className={`relative sm:flex items-center justify-center sm:col-span-6 col-span-full h-screen bg-[url(@/assets/login.jpg)] bg-cover ${i18n.language === 'ar' ? 'rounded-r-3xl' : 'rounded-l-3xl'} hidden px-10`}>
        {/* Overlay for better contrast */}
        <div className={`absolute inset-0 bg-black opacity-70 ${i18n.language === 'ar' ? 'rounded-r-3xl' : 'rounded-l-3xl'}`}></div>

        {/* Header */}
        <div className="text-center text-white z-10 space-y-4 flex flex-col items-center">
          <h1 className="text-6xl" role="heading" aria-level={2}>{t('login.header')}</h1>
          <p className="text-lg max-w-lg">
            {t('login.subheader')}
          </p>
        </div>
      </div>
      {error && (
        <div className="fixed bg-black opacity-80 size-full flex z-40 justify-center items-center px-5">
          <Alert variant="destructive" className="z-50 sm:max-w-xl" role="alert">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              An error occurred while registering :(
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}
