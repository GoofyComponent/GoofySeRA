import {Card} from "@/components/ui/card";

interface PageProps {
  params: {
    section: string;
  };
}

const shortDescExample = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ";
const bgImageExample = "https://destroykeaum.alwaysdata.net/assets/images/pp.jpg";
const projectUrlExample = "https://portfolio.destcom.website/";

export default function Section({ params }: PageProps) {
  const { section } = params;

  return (
    <>
      <p>{section}</p>
      <Card title="test" projectState="Draft" shortDesc={shortDescExample} bgImage={bgImageExample} projectUrl={projectUrlExample}/>
    </>
  );
}
