import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Home() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          Est-ce que la librairie de composant est installée ?
        </AccordionTrigger>
        <AccordionContent>Oui j'en ai bien l'impression !</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Et les couleurs changées ?</AccordionTrigger>
        <AccordionContent>Egalment !</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
