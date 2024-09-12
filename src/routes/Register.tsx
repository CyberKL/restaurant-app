import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  RegisterFormSchema,
  registerationSchema,
} from "@/validations/registrationSchema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import User from "@/types/user";
import { createUser } from "@/api/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";

export default function Register() {
  const [error, setError] = useState<boolean>(false);

  const { toast } = useToast();

  const navigate = useNavigate();

  const form = useForm<RegisterFormSchema>({
    resolver: yupResolver(registerationSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: RegisterFormSchema) => {
    const user: User = {
      fname: data.fname,
      lname: data.lname,
      email: data.email,
      dob: data.dob,
      password: data.password,
    };
    const response: Response | null = await createUser(user);
    console.log(response);

    // Should handle different responses when there is a real backend validating the form data
    if (response && response.ok) {
      navigate("/login");
      toast({
        title: "Registration successful!",
        description:
          "You have registered successfully!, please log in to continue.",
      });
    } else {
      setError(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="relative grid grid-cols-12">
      {/* Back button */}
      <div className="absolute top-0 left-0 p-5">
        <Link to={"/"}>
          <Button
            variant={"ghost"}
            size={"icon"}
            className="hover:scale-110 transition"
          >
            <ChevronLeft color="#16a34a" />
          </Button>
        </Link>
      </div>

      {/* Form */}
      <div className="sm:col-span-6 col-span-full flex flex-col items-center justify-center gap-20 p-10">
        <h1 className="font-bold text-3xl">Register</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:max-w-lg max-w-sm w-full"
          >
            <FormField
              control={form.control}
              name="fname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="date"
                      value={
                        field.value instanceof Date
                          ? field.value.toISOString().split("T")[0]
                          : field.value
                      }
                    />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-green-600 col-span-full">
              Submit
            </Button>
          </form>
        </Form>
        <p className="text-sm">
          Already have an account?{" "}
          <Link
            to={"/login"}
            className="text-green-600 underline italic font-semibold"
          >
            Log In
          </Link>
        </p>
      </div>

      <div className="relative sm:flex items-center justify-center sm:col-span-6 col-span-full h-screen bg-[url(@/assets/register.jpg)] bg-cover rounded-l-3xl hidden px-10">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-70 rounded-l-3xl"></div>

        {/* Header */}
        <div className="text-center text-white z-10 space-y-4 flex flex-col items-center">
          <h1 className="text-6xl">Join Us Today!</h1>
          <p className=" text-lg max-w-lg">
            Sign up now to be part of our healthy eating community and get
            exclusive access to our latest recipes and offers!.
          </p>
        </div>
      </div>
      {error && (
        <div className="fixed bg-black opacity-80 size-full flex z-40 justify-center items-center px-5">
          <Alert variant="destructive" className="z-50 sm:max-w-xl">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              An error occurred while registering :(
            </AlertDescription>
          </Alert>
        </div>
      )}
      <Toaster />
    </div>
  );
}
