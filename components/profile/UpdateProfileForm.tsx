"use client";

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import ProfileUploader from '@/components/shared/ProfileUploader';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Loader from '@/components/ui/Loader';
import { Textarea } from '@/components/ui/textarea';
import { ProfileUpdateValidation } from '@/lib/validations';
import type { User } from '@/db/schema-types';
import { useUpdateUser } from '@/lib/react-query/users';
import type { UpdateUserInput } from '@/actions/users';

type Props = {
  user: Pick<User, 'id' | 'name' | 'username' | 'email' | 'bio' | 'imageUrl'>;
};

type FormValues = {
  name: string;
  username: string;
  email: string;
  bio: string;
  file?: File[];
};

export default function UpdateProfileForm({ user }: Props) {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(ProfileUpdateValidation),
    defaultValues: {
      name: user.name,
      username: user.username || '',
      email: user.email,
      bio: user.bio || '',
      file: undefined,
    },
  });

  const { mutateAsync, isPending } = useUpdateUser();

  useEffect(() => {
    // Reset form whenever user prop changes
    form.reset({
      name: user.name,
      username: user.username || '',
      email: user.email,
      bio: user.bio || '',
      file: undefined,
    });
  }, [user, form]);

  const onSubmit = async (data: FormValues) => {
    const payload: UpdateUserInput = {
      userId: user.id,
      name: data.name,
      bio: data.bio,
      file: data.file && data.file.length > 0 ? data.file[0] : undefined,
    };

    try {
      await mutateAsync(payload);
      router.push(`/profile/${user.id}`);
    } catch (err) {
      // useUpdateUser already shows toast; we still swallow here
      console.error('Failed to update profile', err);
    }
  };

  return (
    <>
      <div className="flex flex-start gap-3 justify-start w-full max-w-5xl">
        <Image src="/icons/edit.svg" alt="edit" width={20} height={20} className="invert-white" />
        <h2 className="h3-bold md:h2-bold text-left w-full">Edit Profile</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-7 w-full mt-4 max-w-5xl">
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem className="flex">
                <FormControl>
                  <ProfileUploader fieldChange={field.onChange} mediaUrl={user.imageUrl ?? '/icons/profile-placeholder.svg'} />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} disabled />
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
                <FormLabel className="shad-form_label">Email</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Bio</FormLabel>
                <FormControl>
                  <Textarea className="shad-textarea custom-scrollbar" {...field} />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />

          <div className="flex gap-4 items-center justify-end">
            <Button
              type="button"
              className="shad-button_dark_4"
              onClick={() => router.push(`/profile/${user.id}`)}
            >
              Cancel
            </Button>

            <Button type="submit" className="shad-button_primary whitespace-nowrap" disabled={isPending}>
              {isPending && <Loader />}
              Update Profile
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
