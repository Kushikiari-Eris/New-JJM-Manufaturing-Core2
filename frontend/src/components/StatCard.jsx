const StatCard = ({ title, value, icon, color }) => {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color}`}>
        <div className="flex items-center">
          <div className="mr-4">{icon}</div>
          <div>
            <h3 className="text-gray-500 text-sm">{title}</h3>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>
      </div>
    );
  };
  
  export default StatCard;