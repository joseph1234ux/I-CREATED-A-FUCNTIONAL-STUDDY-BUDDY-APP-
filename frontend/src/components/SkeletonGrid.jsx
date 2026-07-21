import SkeletonCard from './SkeletonCard';

const SkeletonGrid = ({ count = 6 }) => {
  return (
    <div className="grid-3">
      {[...Array(count)].map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

export default SkeletonGrid;