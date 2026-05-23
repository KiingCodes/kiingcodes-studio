import { PageLayout } from "@/components/PageLayout";
import { useBlogPosts } from "@/hooks/use-dynamic-content";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, Tag } from "lucide-react";
import { format } from "date-fns";
import { PageHero } from "@/components/PageHero";
import heroImage from "@/assets/wallpaper-tech.jpg";

const BlogPage = () => {
  const { data: posts, isLoading } = useBlogPosts();

  return (
    <PageLayout>
      <PageHero
        eyebrow="Journal"
        title={
          <>
            Insights & <span className="text-gradient">Articles</span>
          </>
        }
        description="Stay updated with the latest in tech, design, and digital strategy."
        image={heroImage}
      />
      <div className="pb-20 pt-10">
        <div className="container mx-auto px-4 md:px-6">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-2xl border border-border p-6 animate-pulse">
                  <div className="h-48 bg-secondary rounded-xl mb-4" />
                  <div className="h-6 bg-secondary rounded w-3/4 mb-2" />
                  <div className="h-4 bg-secondary rounded w-full mb-4" />
                  <div className="h-4 bg-secondary rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : !posts?.length ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-muted-foreground text-lg">No blog posts yet. Check back soon! ✨</p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {posts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Link to={`/blog/${post.slug}`}>
                    <div className="bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-all duration-300">
                      {post.cover_image_url && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={post.cover_image_url}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex gap-2 mb-3 flex-wrap">
                            {post.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary flex items-center gap-1">
                                <Tag className="w-3 h-3" />{tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h2>
                        {post.excerpt && (
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                        )}
                        <div className="flex items-center justify-between">
                          {post.published_at && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(post.published_at), "MMM d, yyyy")}
                            </span>
                          )}
                          <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                            Read <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default BlogPage;
