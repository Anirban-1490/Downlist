import { screen, render } from "@testing-library/react";
import { AnimeAppearances } from "Components/Details/AnimeAppearances";

test.skip("all anime appearences renders correctly with correct props", () => {
    render(<AnimeAppearances appearances={[]} />);
    render(
        <AnimeAppearances
            appearances={[
                {
                    role: "Main",
                    anime: {
                        title: "newtitle",
                        images: { jpg: { image_url: "myimage1.jpg" } },
                        mal_id: "1",
                    },
                },
            ]}
        />
    );

    const notFoundText = screen.getByText(/Nothing to show here/i);

    expect(notFoundText).toBeInTheDocument;
});
