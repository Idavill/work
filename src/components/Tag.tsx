type TagProps = {
  tag: string;
  backGroundColor?: string;
  textColor?: string;
};

export default function Tag({ tag }: TagProps) {
  return (
    <div className={`flex border-1 border-gray-100 opacity-60 text-gray-100 w-max py-1 px-2 rounded-4xl`}>
      <h3 className="text-sm">{tag}</h3>
    </div>
  );
}