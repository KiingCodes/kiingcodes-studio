import { PageLayout } from "@/components/PageLayout";
import { useBlogPost } from "@/hooks/use-dynamic-content";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { PremiumBlogPost } from "@/components/PremiumBlogPost";

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useBlogPost(slug || "");

  if (isLoading) {
    return (
      <PageLayout>
        <div className="pt-28 pb-20 container mx-auto px-4 max-w-3xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-secondary rounded w-3/4" />
            <div className="h-4 bg-secondary rounded w-1/2" />
            <div className="h-64 bg-secondary rounded-2xl" />
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error || !post) {
    return (
      <PageLayout>
        <div className="pt-28 pb-20 container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Post not found</h1>
          <Link to="/blog" className="text-primary hover:underline">← Back to blog</Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <article className="pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-6xl mb-6">
          <Link to="/blog" className="text-primary hover:underline text-sm inline-flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to blog
          </Link>
        </div>
        <PremiumBlogPost post={post} />
      </article>
    </PageLayout>
  );
};

export default BlogPostPage;
