import { motion } from "framer-motion";
import { Calendar, Clock, Tag } from "lucide-react";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import { resolveBackground, animationVariants } from "@/lib/background-presets";

export interface PremiumBlogPostData {
  title: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  cover_gradient: string | null;
  accent_color: string | null;
  animation_preset: string | null;
  layout_style: string | null;
  reading_time_minutes: number | null;
  published_at: string | null;
  tags: string[] | null;
}

interface Props {
  post: PremiumBlogPostData;
}

/**
 * Magazine-style premium blog renderer driven by editable fields:
 * cover_gradient, accent_color, animation_preset, layout_style.
 *
 * Layout variants:
 *  - "classic": centered, image above title (default)
 *  - "magazine": large hero with title overlay on cover
 *  - "editorial": sidebar metadata + flowing text
 *  - "minimal": typography-first, no cover
 */
export const PremiumBlogPost = ({ post }: Props) => {
  const layout = post.layout_style ?? "classic";
  const variants = animationVariants(post.animation_preset);
  const coverBg = resolveBackground(post.cover_gradient);
  const accent = post.accent_color || "var(--primary)";

  // Custom CSS variable so prose links/highlights pick up the post's accent
  const accentStyle = {
    "--post-accent": accent,
  } as React.CSSProperties;

  const Meta = () => (
    <div className="flex items-center gap-4 flex-wrap text-sm text-muted-foreground">
      {post.published_at && (
        <span className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {format(new Date(post.published_at), "MMMM d, yyyy")}
        </span>
      )}
      {post.reading_time_minutes && (
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {post.reading_time_minutes} min read
        </span>
      )}
      {post.tags?.map((tag) => (
        <span
          key={tag}
          className="text-xs px-2 py-1 rounded-full flex items-center gap-1"
          style={{
            background: `hsl(${accent} / 0.12)`,
            color: `hsl(${accent})`,
          }}
        >
          <Tag className="w-3 h-3" />
          {tag}
        </span>
      ))}
    </div>
  );

  const Prose = () => (
    <div
      className="prose prose-lg dark:prose-invert max-w-none
        [&_h2]:text-foreground [&_h3]:text-foreground
        [&_p]:text-muted-foreground [&_li]:text-muted-foreground
        [&_strong]:text-foreground [&_blockquote]:border-l-4
        [&_a]:underline"
      style={
        {
          // accent-driven link + heading-rule color
          ["--tw-prose-links" as string]: `hsl(${accent})`,
          ["--tw-prose-invert-links" as string]: `hsl(${accent})`,
        } as React.CSSProperties
      }
    >
      <ReactMarkdown>{post.content}</ReactMarkdown>
    </div>
  );

  // ---------- Magazine ----------
  if (layout === "magazine") {
    return (
      <article style={accentStyle}>
        <motion.header
          initial="hidden"
          animate="visible"
          variants={variants}
          className="relative h-[60vh] min-h-[420px] flex items-end overflow-hidden rounded-3xl mb-12"
        >
          {post.cover_image_url && (
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          {coverBg && (
            <div
              aria-hidden
              className="absolute inset-0"
              style={{ background: coverBg, mixBlendMode: "overlay" }}
            />
          )}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent"
          />
          <div className="relative z-10 p-8 md:p-12 max-w-4xl">
            <Meta />
            <h1
              className="mt-4 text-4xl md:text-6xl font-bold leading-tight"
              style={{ color: `hsl(${accent})` }}
            >
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="mt-4 text-lg text-foreground/90 max-w-2xl">
                {post.excerpt}
              </p>
            )}
          </div>
        </motion.header>
        <div className="container mx-auto px-4 max-w-3xl">
          <Prose />
        </div>
      </article>
    );
  }

  // ---------- Editorial (two-column with sticky sidebar) ----------
  if (layout === "editorial") {
    return (
      <article style={accentStyle} className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={variants}
          className="grid md:grid-cols-[220px_1fr] gap-12"
        >
          <aside className="md:sticky md:top-28 self-start space-y-4">
            {coverBg && (
              <div
                className="aspect-square rounded-2xl"
                style={{ background: coverBg }}
              />
            )}
            <Meta />
          </aside>
          <div>
            <h1
              className="text-3xl md:text-5xl font-bold mb-6 leading-tight"
              style={{ color: `hsl(${accent})` }}
            >
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-xl text-muted-foreground mb-8">
                {post.excerpt}
              </p>
            )}
            {post.cover_image_url && (
              <img
                src={post.cover_image_url}
                alt={post.title}
                className="w-full rounded-2xl mb-8 aspect-video object-cover"
              />
            )}
            <Prose />
          </div>
        </motion.div>
      </article>
    );
  }

  // ---------- Minimal (typography-first) ----------
  if (layout === "minimal") {
    return (
      <article
        style={accentStyle}
        className="container mx-auto px-4 max-w-2xl"
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={variants}
        >
          <div
            className="h-1 w-16 rounded-full mb-6"
            style={{ background: `hsl(${accent})` }}
          />
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            {post.title}
          </h1>
          <Meta />
          {post.excerpt && (
            <p className="text-xl text-muted-foreground my-8 italic border-l-4 pl-4"
              style={{ borderColor: `hsl(${accent})` }}
            >
              {post.excerpt}
            </p>
          )}
          <div className="mt-8">
            <Prose />
          </div>
        </motion.div>
      </article>
    );
  }

  // ---------- Classic (default, with optional gradient frame) ----------
  return (
    <article style={accentStyle} className="container mx-auto px-4 max-w-3xl">
      <motion.div initial="hidden" animate="visible" variants={variants}>
        {(post.cover_image_url || coverBg) && (
          <div
            className="relative w-full rounded-2xl mb-8 aspect-video overflow-hidden"
            style={coverBg ? { background: coverBg } : undefined}
          >
            {post.cover_image_url && (
              <img
                src={post.cover_image_url}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        )}
        <Meta />
        <h1
          className="text-3xl md:text-5xl font-bold mt-4 mb-6 leading-tight"
          style={{ color: `hsl(${accent})` }}
        >
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="text-lg text-muted-foreground mb-8">{post.excerpt}</p>
        )}
        <Prose />
      </motion.div>
    </article>
  );
};