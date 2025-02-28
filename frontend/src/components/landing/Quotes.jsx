export default function Quotes() {
    const quotes = [
      {
        quote: "If you aren’t willing to own a stock for 10 years, don’t even think about owning it for 10 minutes.",
        author: "Warren Buffett",
        role: "CEO of Berkshire Hathaway",
        image: "https://cdn.pixabay.com/photo/2024/09/15/16/46/ai-generated-9049422_1280.png",
      },
      {
        quote: "Compound interest is the eighth wonder of the world. He who understands it, earns it ... he who doesn’t ... pays it.",
        author: " Albert Einstein",
        role: "Theoretical physicist",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzIog5I-xEwK2FICsncP22reWxgrcTfgfFVQ&s",
      },
      {
        quote: "For many, retirement is a time for personal growth, which becomes the path to greater freedom.",
        author: "Robert Delamontague",
        role: "CEO and Chairman of EduNeering, Inc.",
        image: "https://m.media-amazon.com/images/I/71dEblCvnQL._SX450_CR0%2C0%2C450%2C450_.jpg",
      },
      {
        quote: "Many investors prefer comfort, chasing what is popular and loved, rather than pursuing what is out of favor. The markets do not reward comfort.",
        author: "Robert Arnott",
        role: "Investment Manager",
        image: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRsuv18_DbA2zVcWWzt6-Awc7QsMa2-900WkPmdqXkAUycK5JaMmAVUZRwlb-jLuPwP5KN1HtC_AN0vQAv92VGLgEohwSZ4sarN4MYzRNI",
      },
    ];
  
    return (
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Wisdom from Financial Experts
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Learn from the insights of the world's most successful investors and financial minds.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2">
            {quotes.map((quote, index) => (
              <div key={index} className="flex flex-col space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <div className="relative">
                  <span className="absolute -left-3 -top-3 text-6xl text-primary opacity-20">"</span>
                  <p className="relative z-10 italic text-lg">{quote.quote}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <img
                    src={quote.image || "/placeholder.svg"}
                    alt={quote.author}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="font-bold">{quote.author}</h3>
                    <p className="text-sm text-muted-foreground">{quote.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  