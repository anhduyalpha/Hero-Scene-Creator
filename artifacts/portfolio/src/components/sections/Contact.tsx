import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      const form = e.target as HTMLFormElement;
      form.reset();
      
      toast({
        title: "Transmission Complete",
        description: "Your message has been forged and sent. I'll respond shortly.",
        duration: 5000,
      });
    }, 1500);
  };

  return (
    <section id="contact" className="py-32 container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto text-center mb-16"
      >
        <div className="inline-flex items-center justify-center gap-2 text-primary font-mono text-sm mb-4">
          <span className="text-secondary">05.</span> What's Next?
        </div>
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-foreground">
          Get In Touch
        </h2>
        <p className="text-muted-foreground font-sans text-lg leading-relaxed mb-8">
          Whether you have a complex system architecture problem, a challenging frontend requirement, or just want to discuss the finer points of Rust vs Go, my inbox is open. I'll try my best to get back to you.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="max-w-xl mx-auto ember-glass p-8 rounded-xl relative overflow-hidden"
      >
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-primary/50 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-secondary/50 pointer-events-none"></div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="name" className="text-sm font-mono text-muted-foreground">Name</label>
              <input 
                type="text" 
                id="name" 
                required
                className="bg-background/50 border border-border rounded-md px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-sans"
                placeholder="John Doe"
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="email" className="text-sm font-mono text-muted-foreground">Email</label>
              <input 
                type="email" 
                id="email" 
                required
                className="bg-background/50 border border-border rounded-md px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-sans"
                placeholder="john@example.com"
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="message" className="text-sm font-mono text-muted-foreground">Message</label>
            <textarea 
              id="message" 
              required
              rows={5}
              className="bg-background/50 border border-border rounded-md px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-sans resize-none"
              placeholder="Let's build something..."
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="mt-2 bg-gradient-to-r from-primary to-orange-600 text-background font-bold py-4 rounded-md flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin text-background" />
            ) : (
              <>
                Send Message
                <Send className="w-4 h-4 ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </section>
  );
}
