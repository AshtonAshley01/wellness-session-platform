type SessionCardProps = {
    title: string;
    tags: string[];
  };
  
  const SessionCard = ({ title, tags }: SessionCardProps) => {
    return (
      <div className="border rounded-lg p-4 shadow-md bg-white">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    );
  };
  
  export default SessionCard;
  