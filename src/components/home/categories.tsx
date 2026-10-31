import React from "react";
import Link from "next/link";
import { BookOpen, Atom, Landmark, Baby, Compass, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";

export function Categories() {
  const categoryList = [
    {
      name: "Fiction",
      slug: "Fiction",
      description: "Novels, contemporary stories, poetry, and evocative prose.",
      icon: BookOpen,
      count: "120+ titles",
      gridSpan: "col-span-1 md:col-span-2",
    },
    {
      name: "Science",
      slug: "Science",
      description: "Cosmology, astrophysics, evolutionary biology, and computing.",
      icon: Atom,
      count: "85+ titles",
      gridSpan: "col-span-1",
    },
    {
      name: "History",
      slug: "History",
      description: "Chronicles of civilization, war memoirs, and cultural heritage.",
      icon: Landmark,
      count: "60+ titles",
      gridSpan: "col-span-1",
    },
    {
      name: "Kids",
      slug: "Kids",
      description: "Illustrated fables, early reader favorites, and bedtime stories.",
      icon: Baby,
      count: "45+ titles",
      gridSpan: "col-span-1 md:col-span-2",
    },
    {
      name: "Others",
      slug: "Others",
      description: "Art, architecture, philosophy, journals, and memoirs.",
      icon: Compass,
      count: "50+ titles",
      gridSpan: "col-span-1 md:col-span-3",
    },
  ];

  return (
    <section className="w-full flex flex-col gap-8">
      <div>
        <div className="text-primary text-xs font-semibold uppercase tracking-wider mb-2">
          Curated Genres
        </div>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">
          Top Categories
        </h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-lg">
          Filter through literary departments to find your next weekend read.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {categoryList.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.slug}
              href={`/books?category=${cat.slug}`}
              className={cat.gridSpan}
            >
              <Card className="h-full rounded-2xl border-border bg-card/70 hover:bg-card hover:border-primary/50 transition-all duration-300 p-6 flex flex-col justify-between group shadow-xs">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 group-hover:scale-105 transition-transform">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary/40 transition-colors">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                      {cat.name}
                    </h3>
                    <span className="text-xs font-mono text-muted-foreground">
                      {cat.count}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
