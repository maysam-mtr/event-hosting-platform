import { Button3 } from "../../../components/Navbar/Navbar";
import { Card, EventTitle, PreviewImg, Schedule, StatusIndicator } from "../../HostPortal/MyEventsPage/MyEventsPage";
import { CardsWrapper, PageTitle, Section } from "../SettingsPage/SettingsPage";

export default function ExploreEventsPage(){
      const events = [
        {
          id: 1,
          preview: previewImg, 
          name: "Tech Conference 2025",
          status: "live",
          host: "John Doe",
          dateTime: "April 10, 2025 - 3:00 PM",
        },
        {
          id: 2,
          preview: previewImg, 
          name: "Startup Pitch Night",
          status: "upcoming",
          host: "Jane Smith",
          dateTime: "April 15, 2025 - 6:00 PM",
        },
        {
          id: 3,
          preview: previewImg, 
          name: "AI & Machine Learning Summit",
          status: "closed",
          host: "Michael Johnson",
          dateTime: "March 20, 2025 - 10:00 AM",
        },
      ];

    return (
        <Section>
            <PageTitle>Explore Public Events</PageTitle>
            <CardsWrapper>
                    {events.map((event) => (
                      <Card key={event.id}>
                        <PreviewImg src={event.preview} alt={event.name} />
                        <EventTitle>{event.name}</EventTitle>
                        <StatusIndicator $status={event.status}>{event.status.toUpperCase()}</StatusIndicator>
                        <Schedule>{event.dateTime}</Schedule>
                        <Button3 style={{fontSize: 'var(--body)'}}>View Details</Button3>
                      </Card>
                    ))}
                  </CardsWrapper>
        </Section>
    )
}