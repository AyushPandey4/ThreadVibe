"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Github, Moon, Sun, Sparkles, Eye, Code, Download } from "lucide-react";
import { useTheme } from "next-themes";
import ReactMarkdown from "react-markdown";

const vibeOptions = [
  { id: "funny", label: "Funny", emoji: "😄" },
  { id: "poetic", label: "Poetic", emoji: "🎭" },
  { id: "business", label: "Business", emoji: "💼" },
  { id: "sarcastic", label: "Sarcastic", emoji: "😏" },
  { id: "gen-z", label: "Gen-Z", emoji: "🔥" },
  { id: "technical",label: "Technical", emoji: "⚡" },
  { id: "inspirational", label: "Inspirational", emoji: "✨" },
];

function Toast({ message, type }) {
  if (!message) return null;
  return (
    <div
      className={`fixed top-6 right-6 z-[100] min-w-[220px] max-w-xs px-5 py-3 rounded-xl flex items-center gap-3 shadow-2xl border
        ${type === "error"
          ? "bg-red-600/90 border-red-700 text-white"
          : "bg-green-600/90 border-green-700 text-white"}
        animate-fade-in-up`}
      style={{
        transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {type === "error" ? (
        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      ) : (
        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
      )}
      <span className="font-medium text-base">{message}</span>
    </div>
  );
}

export default function ThreadVibeLanding() {
  const [mounted, setMounted] = useState(false);
  const [threadContent, setThreadContent] = useState("");
  const [threadUrl, setThreadUrl] = useState("");
  const [selectedVibe, setSelectedVibe] = useState("technical");
  const [customVibe, setCustomVibe] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" });
  const [result, setResult] = useState(null);
  const [markdownContent, setMarkdownContent] = useState("");
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const handleVibeSelect = (vibeId) => {
    setSelectedVibe(selectedVibe === vibeId ? "" : vibeId);
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "success" }), 3000);
  };

  const handleGenerate = async () => {
    if (!threadContent && !threadUrl) {
      showToast("Please provide either thread content or URL", "error");
      return;
    }

    if (!selectedVibe && !customVibe) {
      showToast("Please select a vibe or provide a custom one", "error");
      return;
    }

    setLoading(true);
    setResult(null); 
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadText: threadContent,
          threadUrl,
          selectedTone: selectedVibe,
          customVibe,
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        showToast("Some error occurred, try again!", "error");
        setLoading(false);
        return;
      }
      if (res.status === 429) {
        showToast("Rate limit exceeded. Please try again later.", "error");
        return;
      }
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate blog post");
      }

      setResult(data);
      setMarkdownContent(data.contentMarkdown);
      showToast("Blog post generated successfully!");
    } catch (error) {
      showToast(
        error.message && !error.message.includes("Failed to parse")
          ? error.message
          : "Some error occurred, try again!",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdownContent);
      showToast("Copied to clipboard!");
    } catch (err) {
      showToast("Failed to copy", "error");
    }
  };

  const handleDownload = () => {
    if(!result) return;
    const blob = new Blob([markdownContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${result.seo.slug || 'blog-post'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Downloaded markdown file!");
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute top-20 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 -right-20 w-[30rem] h-[30rem] bg-accent/20 rounded-full blur-3xl animate-pulse-slow delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-primary/10 rounded-full blur-3xl animate-pulse-slow delay-500" />
      </div>
      
      <Toast {...toast} />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-background/70 backdrop-blur-lg">
        <nav className="mx-auto max-w-screen-2xl">
          <div className="flex h-20 items-center justify-between">
            <a href="#" className="flex items-center space-x-3 group pl-6">
              <div className="relative">
                <Sparkles className="h-7 w-7 text-primary transition-all duration-300 group-hover:rotate-12 animate-glow" />
                <div className="absolute inset-0 bg-primary/20 blur-sm animate-pulse-slow"></div>
              </div>
              <span className="font-bold text-xl modern-text-gradient">ThreadVibe</span>
            </a>
            <div className="ml-auto flex items-center pr-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full w-10 h-10 hover:bg-background/80 animate-float"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
              <a 
                href="https://github.com/Ayush6968" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group ml-4 p-2.5 rounded-full hover:bg-background/80 transition-colors animate-float"
              >
                <Github className="h-5 w-5 text-foreground/70 transition-all duration-300 group-hover:text-foreground group-hover:rotate-12" />
              </a>
            </div>
          </div>
        </nav>
      </header>
      
      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-12 md:py-20 flex flex-col items-center">
        <div className="text-center mb-12 animate-fade-in-up max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-10 modern-text-gradient leading-normal pt-2">
            Turn any thread into a blog — in your own vibe.
          </h1>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Transform threads into engaging blog posts with AI-powered style adaptation. Choose your vibe and let the magic happen.
          </p>
        </div>
        
        <div className="w-full max-w-3xl space-y-8">
          <Card className="animate-slide-in-left modern-card p-6 md:p-8 space-y-6">
            <div className="space-y-4">
              <label className="text-sm font-medium text-foreground">Thread Content</label>
              <Textarea
                placeholder="Paste your thread content here..."
                value={threadContent}
                onChange={(e) => setThreadContent(e.target.value)}
                className="modern-input min-h-36 resize-none"
              />
            </div>
            
            {/* <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/40" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card/80 backdrop-blur-sm px-2 text-foreground/70">or</span>
              </div>
            </div> */}
            
            {/*
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Thread URL</label>
              <Input
                placeholder="Paste the thread URL here..."
                value={threadUrl}
                onChange={(e) => setThreadUrl(e.target.value)}
                className="modern-input"
              />
            </div>
            */}
            
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Choose Your Vibe</label>
              <div className="flex flex-wrap gap-2">
                {vibeOptions.map((vibe) => (
                  <Button
                    key={vibe.id}
                    variant={selectedVibe === vibe.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleVibeSelect(vibe.id)}
                    className={`rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                      selectedVibe === vibe.id 
                        ? 'modern-gradient text-white font-medium shadow-lg hover:shadow-primary/30 animate-glow' 
                        : 'bg-card hover:bg-card/80 border-2 border-border hover:border-primary/50 text-foreground font-medium'
                    }`}
                  >
                    <span className="mr-2 text-lg select-none">{vibe.emoji}</span>
                    <span>{vibe.label}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Custom Vibe (Optional)</label>
              <Input
                placeholder="e.g., 'like a 1950s detective' or 'a formal scientific paper'"
                value={customVibe}
                onChange={(e) => setCustomVibe(e.target.value)}
                className="modern-input"
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={loading}
              size="lg"
              className="w-full font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] modern-gradient text-primary-foreground shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed animate-glow"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              {loading ? "Generating..." : "Generate Post"}
            </Button>
          </Card>
          
          {loading && (
            <div className="flex flex-col items-center justify-center text-center p-8 space-y-4 animate-fade-in">
              <div className="relative">
                <Sparkles className="h-8 w-8 text-primary animate-spin" />
                <div className="absolute inset-0 bg-primary/20 blur-sm animate-pulse"></div>
              </div>
              <p className="text-foreground/80">Brewing your content with style... please wait.</p>
            </div>
          )}

          {result && (
            <div className="animate-fade-in-up space-y-8">
              <Card className="modern-card overflow-hidden">
                <Tabs defaultValue="preview" className="w-full">
                  <TabsList className="w-full p-0 h-12 bg-muted/50 backdrop-blur-sm border-b border-border/40">
                    <TabsTrigger 
                      value="preview" 
                      className="flex-1 h-12 data-[state=active]:bg-background/50 data-[state=active]:border-b-2 data-[state=active]:border-primary text-foreground"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </TabsTrigger>
                    <TabsTrigger 
                      value="markdown" 
                      className="flex-1 h-12 data-[state=active]:bg-background/50 data-[state=active]:border-b-2 data-[state=active]:border-primary text-foreground"
                    >
                      <Code className="h-4 w-4 mr-2" />
                      Markdown
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="preview" className="p-6">
                    <article className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                      <ReactMarkdown>{markdownContent}</ReactMarkdown>
                    </article>
                  </TabsContent>
                  
                  <TabsContent value="markdown" className="p-6">
                    <pre className="bg-muted/30 backdrop-blur-sm p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm text-foreground">{markdownContent}</code>
                    </pre>
                  </TabsContent>
                </Tabs>
              </Card>

              <Card className="modern-card p-6 space-y-6 bg-background/80 backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  SEO Metadata
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Badge variant="outline" className="text-xs font-medium bg-background/50 text-foreground">Title</Badge>
                    <p className="text-base font-medium text-foreground bg-muted/50 backdrop-blur-sm p-3 rounded-lg border border-border/40">{result.seo.title}</p>
                  </div>
                  <div className="space-y-2">
                    <Badge variant="outline" className="text-xs font-medium bg-background/50 text-foreground">Description</Badge>
                    <p className="text-base text-foreground bg-muted/50 backdrop-blur-sm p-3 rounded-lg border border-border/40">{result.seo.description}</p>
                  </div>
                  <div className="space-y-2">
                    <Badge variant="outline" className="text-xs font-medium bg-background/50 text-foreground">Slug</Badge>
                    <p className="text-base font-mono text-foreground bg-muted/50 backdrop-blur-sm p-3 rounded-lg border border-border/40">{result.seo.slug}</p>
                  </div>
                </div>
              </Card>

              {/* AI Image Prompt Card */}
              {result.imagePrompt && (
                <Card className="modern-card p-6 space-y-4 bg-background/80 backdrop-blur-sm">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    🎨 AI Image Prompt
                  </h3>
                  <div className="flex items-center gap-2">
                    <p className="flex-1 text-base font-mono text-foreground bg-muted/50 backdrop-blur-sm p-3 rounded-lg border border-border/40 select-all">
                      {result.imagePrompt}
                    </p>
                    <Button
                      size="icon"
                      variant="outline"
                      className="ml-2"
                      onClick={async () => {
                        await navigator.clipboard.writeText(result.imagePrompt);
                        showToast('Image prompt copied!');
                      }}
                    >
                      <Code className="h-5 w-5" />
                    </Button>
                  </div>
                </Card>
              )}

              <div className="flex gap-4">
                <Button
                  onClick={handleCopy}
                  className="flex-1 py-6 rounded-xl modern-gradient text-primary-foreground font-medium shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-[1.02] animate-glow"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Code className="h-5 w-5" />
                    Copy Markdown
                  </div>
                </Button>
                <Button
                  onClick={handleDownload}
                  className="flex-1 py-6 rounded-xl modern-gradient text-primary-foreground font-medium shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-[1.02] animate-glow"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Download className="h-5 w-5" />
                    Download Markdown
                  </div>
                </Button>
              </div>

              {/* Share on Blogging Platforms */}
              <div className="mt-6">
                <div className="mb-2 text-center font-semibold text-lg text-foreground/80">Share on Blogging Platforms</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Hashnode */}
                  <Button
                    aria-label="Share on Hashnode"
                    onClick={async () => {
                      await navigator.clipboard.writeText(markdownContent);
                      window.open('https://hashnode.com/new', '_blank');
                      showToast('Markdown copied! Paste it into your new Hashnode post.');
                    }}
                    className="w-full py-4 rounded-xl bg-[#2962ff]/90 hover:bg-[#2962ff] text-white font-semibold flex items-center justify-center shadow-md transition-all duration-300"
                  >
                    Hashnode
                  </Button>
                  {/* Medium */}
                  <Button
                    aria-label="Share on Medium"
                    onClick={async () => {
                      await navigator.clipboard.writeText(markdownContent);
                      window.open('https://medium.com/new-story', '_blank');
                      showToast('Markdown copied! Paste it into your new Medium story.');
                    }}
                    className="w-full py-4 rounded-xl bg-[#00ab6c]/90 hover:bg-[#00ab6c] text-white font-semibold flex items-center justify-center shadow-md transition-all duration-300"
                  >
                    Medium
                  </Button>
                  {/* Dev.to */}
                  <Button
                    aria-label="Share on Dev.to"
                    onClick={async () => {
                      await navigator.clipboard.writeText(markdownContent);
                      window.open('https://dev.to/new', '_blank');
                      showToast('Markdown copied! Paste it into your new Dev.to post.');
                    }}
                    className="w-full py-4 rounded-xl bg-[#0a0a0a]/90 hover:bg-[#0a0a0a] text-white font-semibold flex items-center justify-center shadow-md transition-all duration-300"
                  >
                    Dev.to
                  </Button>
                  {/* Ghost */}
                  <Button
                    aria-label="Share on Ghost"
                    onClick={async () => {
                      await navigator.clipboard.writeText(markdownContent);
                      window.open('https://ghost.org/', '_blank');
                      showToast('Markdown copied! Paste it into your Ghost editor.');
                    }}
                    className="w-full py-4 rounded-xl bg-[#15171a]/90 hover:bg-[#15171a] text-white font-semibold flex items-center justify-center shadow-md transition-all duration-300"
                  >
                    Ghost
                  </Button>
                  {/* Notion */}
                  <Button
                    aria-label="Share on Notion"
                    onClick={async () => {
                      await navigator.clipboard.writeText(markdownContent);
                      window.open('https://www.notion.so/', '_blank');
                      showToast('Markdown copied! Paste it into your Notion page.');
                    }}
                    className="w-full py-4 rounded-xl bg-[#000]/90 hover:bg-[#000] text-white font-semibold flex items-center justify-center shadow-md transition-all duration-300"
                  >
                    Notion
                  </Button>
                  {/* WordPress */}
                  <Button
                    aria-label="Share on WordPress"
                    onClick={async () => {
                      await navigator.clipboard.writeText(markdownContent);
                      window.open('https://wordpress.com/post', '_blank');
                      showToast('Markdown copied! Paste it into your new WordPress post.');
                    }}
                    className="w-full py-4 rounded-xl bg-[#21759b]/90 hover:bg-[#21759b] text-white font-semibold flex items-center justify-center shadow-md transition-all duration-300"
                  >
                    WordPress
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
