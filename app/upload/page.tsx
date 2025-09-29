import { Container, Section } from "@/components/ds";
import { WeddingUploaderComponent } from "./_components/WeddingUploaderComponent";

export default function UploadPage() {
    return (
        <Section>
            <Container>
                <div className="flex flex-col gap-2 items-center justify-center">
                    <h2>Upload dine billeder</h2>
                    <p>Del dine yndlings øjeblikke fra vores bryllup</p>
                </div>
            </Container>
            <Container>
                <WeddingUploaderComponent />
            </Container>
        </Section>
    );
}
