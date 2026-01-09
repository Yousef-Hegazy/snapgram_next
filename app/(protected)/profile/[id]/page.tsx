type Props = {
  params: Promise<{
    id: string;
  }>;
};

const ProfilePage = async ({ params }: Props) => {
  const { id } = await params;
  return <div>ProfilePage {id}</div>;
};

export default ProfilePage;
