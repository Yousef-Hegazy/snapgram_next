"use client";

import { Button } from "@/components/ui/button";
import FileUploader from "@/components/ui/FileUploader";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/Loader";
import { Textarea } from "@/components/ui/textarea";
import { Post, User } from "@/db/schema-types";
import { useCreatePost, useEditPost } from "@/lib/react-query";
import { PostValidation, PostValidationType } from "@/lib/validations";
import type { INewPost } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

interface PostFormProps {
  post?: Post;
  user: User;
}

const PostForm = ({ post, user }: PostFormProps) => {
  const { mutate: createPost, isPending: isCreatingPost } = useCreatePost();
  const { mutate: editPost, isPending: isEditingPost } = useEditPost();
  const form = useForm<PostValidationType>({
    resolver: zodResolver(PostValidation),
    mode: "all",
    defaultValues: {
      caption: "",
      location: "",
      tags: "",
    },
  });

  const capt = useWatch({
    control: form.control,
    name: "caption",
  });

  const captionLength = capt ? capt.length : 0;

  useEffect(() => {
    if (post) {
      form.reset({
        caption: post.caption || "",
        location: post.location || "",
        tags: post.tags?.join(", ") || "",
        file: [],
      });
    }
  }, [post, form]);

  const onSubmit = async (data: PostValidationType) => {
    if (!user || !user.id) {
      toast.error("You must be logged in to create a post.");
      return;
    }

    const tags = data.tags
      ? data.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag)
      : [];

    const submitData: INewPost = {
      userId: user.id,
      caption: data.caption,
      file: data.file,
      location: data.location,
      tags,
    };

    if (post && post.id) {
      editPost({ ...submitData, id: post.id });
    } else {
      createPost(submitData);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <Textarea className="shad-textarea custom-scrollbar" {...field} />
                  <p className="small-regular text-light-3">{captionLength} / 2200 characters</p>
                </div>
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Photos</FormLabel>
              <FormControl>
                <FileUploader fieldChange={field.onChange} mediaUrl={post?.imageUrl} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Tags (separated by comma &quot; , &quot;)</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" placeholder="Art, Expression, Learn" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <div className="flex gap-4 items-center justify-end">
          <Link href="/posts">
            <Button type="button" className="shad-button_dark_4">
              Cancel
            </Button>
          </Link>

          <Button
            type="submit"
            disabled={isCreatingPost || isEditingPost}
            className="shad-button_primary whitespace-nowrap"
          >
            {isCreatingPost || isEditingPost ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : post ? (
              "Update Post"
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
