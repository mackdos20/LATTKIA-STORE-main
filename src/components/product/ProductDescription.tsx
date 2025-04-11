interface ProductDescriptionProps {
  description: string;
}

const ProductDescription = ({ description }: ProductDescriptionProps) => {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <p className="text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
};

export default ProductDescription; 