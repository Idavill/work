type PaperTagProps = {
  id:string;
  tag: string;
  backGroundColor?: string;
  textColor?: string;
  color:string;
  width:string;
};

export default function PaperTag({ id, tag, color, width }: PaperTagProps) {
  return (
    <div key={id} className={`px-6 flex ${width} border-1 ${color? color :"hover:border-gray-500 "}  ${color} py-1`}>
      <h3 className="text-sm">{tag}</h3>
    </div>
  );
}