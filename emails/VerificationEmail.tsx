import { Html, Head, Body, Container, Text, Heading } from "@react-email/components";

interface VerificationEmailProps {
    username: string;
    otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
    return (
        <Html>
            <Head />
            <Body style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f9f9f9", padding: "20px" }}>
                <Container style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "8px" }}>
                    <Heading>Hello {username} 👋,</Heading>
                    <Text>Here's your OTP code:</Text>
                    <Text style={{ fontSize: "24px", fontWeight: "bold", color: "#4f46e5" }}>{otp}</Text>
                    <Text>Please use this OTP to complete your verification.</Text>
                    <Text>Thanks,<br />Your Team</Text>
                </Container>
            </Body>
        </Html>
    );
}
