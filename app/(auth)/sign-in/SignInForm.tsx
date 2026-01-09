"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/Loader";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useSignInAccount } from "@/lib/react-query";
import { SignInValidation } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import * as z from "zod";

type FormFields = z.infer<typeof SignInValidation>;

export default function SignInForm() {
  const form = useForm<FormFields>({
    resolver: zodResolver(SignInValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutateAsync: signInAccount, isPending: isSigningIn } = useSignInAccount();

  const onSubmit = async (data: FormFields) => {
    await signInAccount({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <Image src="/images/logo.svg" alt="Logo" width={170} height={100} />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Login to your account</h2>
        <p className="text-light-3 small-medium md:base-regular">
          Welcome back! Please enter your details.
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4"
          autoComplete="none"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" autoComplete="email" {...field} />
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
                  <PasswordInput className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="shad-button_primary">
            {isSigningIn ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Sign In"
            )}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Don&apos;t have an account?
            <Link href="/sign-up" className="text-primary-500 text-sm-semibold ml-1">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
}
