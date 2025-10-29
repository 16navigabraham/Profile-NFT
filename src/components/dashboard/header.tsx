"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Copy, Link as LinkIcon, Share2 } from "lucide-react";

const Header = () => {
  const { toast } = useToast();

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description:
          "Your Onchain Portfolio link has been copied to your clipboard.",
      });
    }
  };

  return (
    <header className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-10">
      <div className="flex items-center gap-3">
        <div className="bg-primary/20 p-2 rounded-lg">
          <LinkIcon className="text-primary" />
        </div>
        <h1 className="text-xl font-bold text-white font-headline">
          Onchain Portfolio
        </h1>
      </div>
      <Button
        onClick={handleShare}
        variant="outline"
        className="bg-transparent border-primary text-primary hover:bg-primary/10 hover:text-primary"
      >
        <Share2 className="mr-2 h-4 w-4" />
        Share Profile
      </Button>
    </header>
  );
};

export default Header;
