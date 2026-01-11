"use client";

import { DeletePostDialog } from "@/components/shared/DeletePostDialog";
import { Button } from "@/components/ui/button";
import { useDeletePost } from "@/lib/react-query";
import Image from "next/image";

type Props = {
  postId: string;
  userId: string;
};

const DeletePostBtn = ({ postId, userId }: Props) => {
  const deletePostMutation = useDeletePost();

  return (
    <DeletePostDialog
      onDelete={() => {
        deletePostMutation.mutate({ postId, userId });
      }}
      isPending={deletePostMutation.isPending}
    >
      <Button variant="ghost" className="post_details-delete_btn!">
        <Image src="/icons/delete.svg" alt="delete" width={24} height={24} />
      </Button>
    </DeletePostDialog>
  );
};

export default DeletePostBtn;
