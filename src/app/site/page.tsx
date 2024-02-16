import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { pricingCards } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="h-full">
      <section className="w-full h-full relative flex items-center justify-center pt-36 flex-col">
        <div className="absolute inset-0 h-full w-full bg-[radial-gradient(#d1d3d6_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:bg-[radial-gradient(#2d323b_1px,transparent_1px)]"></div>
        <p>Run your agency in one place</p>
        <div className="bg-gradient-to-r from-primary to-secondary-foreground text-transparent relative bg-clip-text">
          <h1 className="font-bold text-8xl text-center md:text-[200px]">
            Plura
          </h1>
        </div>
        <div className="relative flex items-center">
          <Image
            src="/assets/preview.png"
            alt="project management preview"
            height={1200}
            width={1200}
            className="rounded-t-2xl border-2 border-muted"
          />
        </div>
        <div className="absolute bottom-0 top-1/2 bg-gradient-to-t dark:from-background left-0 right-0 z-10" />
      </section>
      <section className="flex flex-col items-center my-16 px-4">
        <h2 className="text-4xl font-semibold text-center">
          Choose what fits you right
        </h2>
        <p className="text-muted-foreground mt-2 text-center">
          Our straightforward pricing plans are tailored to meet your needs. If
          you&apos;re not ready to commit you can get started for free.
        </p>
        <div className="flex gap-4 justify-center flex-wrap mt-8">
          {pricingCards.map((item) => (
            // TODO: Wire up free product from stripe
            <Card
              key={item.title}
              className={cn("flex flex-col w-[300px] justify-between", {
                "border-2 border-primary": item.title === "Unlimited Saas",
              })}
            >
              <CardHeader>
                <CardTitle
                  className={cn("text-xl", {
                    "text-muted-foreground": item.title !== "Unlimited Saas",
                  })}
                >
                  {item.title}
                </CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-4xl font-bold">{item.price}</span>
                <span className="text-muted-foreground">
                  {item.duration ? "/" + item.duration : null}
                </span>
              </CardContent>
              <CardFooter className="flex-col items-start gap-4">
                <div className="space-y-1.5">
                  {item.features.map((feat, index) => (
                    <div key={index} className="flex text-sm items-center">
                      <Check className="text-muted-foreground" size={16} />
                      <span className=" ml-1.5">{feat}</span>
                    </div>
                  ))}
                </div>
                <Button
                  asChild
                  className={cn({
                    "!bg-secondary text-secondary-foreground hover:!bg-secondary/80":
                      item.title !== "Unlimited Saas",
                  })}
                >
                  <Link
                    href={`/agency?plan=${item.priceId}`}
                    className="w-full"
                  >
                    Get started
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
