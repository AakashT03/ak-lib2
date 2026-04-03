import { ExternalLink, GraduationCap } from "lucide-react";
import { motion } from "motion/react";
import { mockLearningResources } from "../data/mockData";

const CATEGORIES = [
  "Science",
  "Mathematics",
  "Programming",
  "Videos",
  "Reference",
] as const;
type Category = (typeof CATEGORIES)[number];

const CATEGORY_CONFIGS: Record<
  Category,
  { color: string; bg: string; description: string }
> = {
  Science: {
    color: "#22B7AD",
    bg: "rgba(34,183,173,0.1)",
    description: "Simulations, experiments, and interactive science tools",
  },
  Mathematics: {
    color: "#D18A4A",
    bg: "rgba(209,138,74,0.1)",
    description: "Calculators, problem solvers, and math learning resources",
  },
  Programming: {
    color: "#2ECC9A",
    bg: "rgba(46,204,154,0.1)",
    description: "Coding courses, exercises, and developer tools",
  },
  Videos: {
    color: "#7B5EA7",
    bg: "rgba(123,94,167,0.1)",
    description: "Educational video lectures and explainer series",
  },
  Reference: {
    color: "#4ECDC4",
    bg: "rgba(78,205,196,0.1)",
    description: "Textbooks, encyclopedias, and research databases",
  },
};

export default function ELearningPage() {
  return (
    <div className="p-4 md:p-6 space-y-8">
      <div>
        <h2 className="text-xl font-semibold" style={{ color: "#E8EEF6" }}>
          E-Learning Center
        </h2>
        <p className="text-sm" style={{ color: "#7F93A8" }}>
          Curated educational resources and learning tools
        </p>
      </div>

      {CATEGORIES.map((cat) => {
        const resources = mockLearningResources.filter(
          (r) => r.category === cat,
        );
        const config = CATEGORY_CONFIGS[cat];
        return (
          <motion.section
            key={cat}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: CATEGORIES.indexOf(cat) * 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                style={{ background: config.bg }}
              >
                {resources[0]?.icon || "📚"}
              </div>
              <div>
                <h3
                  className="text-base font-semibold"
                  style={{ color: config.color }}
                >
                  {cat}
                </h3>
                <p className="text-xs" style={{ color: "#7F93A8" }}>
                  {config.description}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {resources.map((res, i) => (
                <motion.div
                  key={res.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="lib-card p-4 hover:scale-[1.02] transition-transform cursor-pointer group"
                  data-ocid={`elearning.${cat.toLowerCase()}.item.${i + 1}`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: config.bg }}
                    >
                      {res.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4
                        className="font-semibold text-sm leading-tight"
                        style={{ color: "#E8EEF6" }}
                      >
                        {res.title}
                      </h4>
                    </div>
                  </div>
                  <p
                    className="text-xs mb-4 line-clamp-2"
                    style={{ color: "#A9B6C6" }}
                  >
                    {res.description}
                  </p>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 text-xs font-medium py-2 px-3 rounded-lg transition-colors w-full"
                    style={{ background: config.bg, color: config.color }}
                    onClick={(e) => e.stopPropagation()}
                    data-ocid={`elearning.${cat.toLowerCase()}.open.button.${i + 1}`}
                  >
                    <ExternalLink size={12} /> Open Resource
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.section>
        );
      })}

      <div
        className="lib-card p-5 text-center"
        style={{ borderColor: "rgba(34,183,173,0.3)" }}
      >
        <GraduationCap
          className="w-8 h-8 mx-auto mb-2"
          style={{ color: "#22B7AD" }}
        />
        <p className="font-medium mb-1" style={{ color: "#E8EEF6" }}>
          Suggest a Learning Resource
        </p>
        <p className="text-sm" style={{ color: "#7F93A8" }}>
          Help us build a better learning collection. Contact your librarian to
          suggest new resources.
        </p>
      </div>
    </div>
  );
}
