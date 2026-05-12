import {
  motion,
  useScroll,
  useVelocity,
  useTransform,
  useSpring,
  useAnimationFrame,
  useMotionValue,
} from "framer-motion";

function MarqueeRow({ label, baseVelocity, scrollContainer }) {
  const baseX = useMotionValue(0);

  const { scrollY } = useScroll({ container: scrollContainer });
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  // baseX always increases; direction is encoded in the transform below.
  // This avoids non-monotonic output from wrap() with a negative range.
  const period = 50; // one copy = 12.5% of 8-copy total
  const isLeft = baseVelocity < 0;
  const x = useTransform(baseX, (v) => {
    const mod = ((v % period) + period) % period; // always in [0, 12.5)
    return `${isLeft ? -mod - period : mod - period}%`;
    // left:  cycles -12.5% → -25% → -12.5%  (moves left)
    // right: cycles -12.5% →   0% → -12.5%  (moves right)
  });

  useAnimationFrame((_, delta) => {
    const vf = velocityFactor.get();
    // Accumulate using absolute velocity; direction handled in transform
    const moveBy = Math.abs(vf) * Math.abs(baseVelocity) * (delta / 1000);
    baseX.set(baseX.get() + moveBy);
  });

  const repeated = Array(8).fill(label);

  return (
    <div className="overflow-hidden border-t border-neutral-200 dark:border-neutral-800">
      <motion.div
        className="flex whitespace-nowrap items-center py-3 laptop:py-4 gap-10"
        style={{ x }}
      >
        {repeated.map((text, i) => (
          <span
            key={i}
            className="flex items-center gap-10 text-2xl laptop:text-4xl font-black uppercase tracking-tight"
          >
            {text}
            <span className="text-neutral-300 dark:text-neutral-700 text-sm">
              ◆
            </span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function WorkMarquee({ scrollContainer, organizations }) {
  return (
    <div>
      {organizations.map((org, i) => (
        <MarqueeRow
          key={org.id ?? i}
          label={`${org.name}  —  ${org.role}`}
          baseVelocity={i % 2 === 0 ? -4 : 4}
          scrollContainer={scrollContainer}
        />
      ))}
      <div className="border-t border-neutral-200 dark:border-neutral-800" />
    </div>
  );
}
