interface PageProps {
  params: {
    pain: string;
  };
}

export default function Pain({ params }: PageProps) {
  const typedepain = params.pain;
  return (
    <div>
      <p>{typedepain}</p>
    </div>
  );
}
