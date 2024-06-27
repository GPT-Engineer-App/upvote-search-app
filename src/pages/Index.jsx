import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("https://hacker-news.firebaseio.com/v0/topstories.json")
      .then((response) => response.json())
      .then((storyIds) => {
        const top100Ids = storyIds.slice(0, 100);
        return Promise.all(
          top100Ids.map((id) =>
            fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(
              (response) => response.json()
            )
          )
        );
      })
      .then((stories) => {
        setStories(stories);
        setFilteredStories(stories);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching stories:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setFilteredStories(
      stories.filter((story) =>
        story.title.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, stories]);

  return (
    <div className="p-4">
      <h1 className="text-3xl text-center mb-4">Hacker News Top Stories</h1>
      <Input
        placeholder="Search stories..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />
      {loading ? (
        <Skeleton className="w-full h-8 mb-2" count={10} />
      ) : (
        filteredStories.map((story) => (
          <Card key={story.id} className="mb-4">
            <CardHeader>
              <CardTitle>{story.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Upvotes: {story.score}</p>
              <a href={story.url} target="_blank" rel="noopener noreferrer">
                Read more
              </a>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default Index;