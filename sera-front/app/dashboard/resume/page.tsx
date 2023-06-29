interface PageProps {
  params: {
    section: string;
  };
}

export default function Section({ params }: PageProps) {
  const { section } = params;

  return (
    <>
      <p>Resume</p>
    </>
  );
}
