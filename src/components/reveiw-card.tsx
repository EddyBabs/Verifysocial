import Ratings from "./ui/ratings";

const ReviewCard = () => {
  return (
    <div className="p-4 border-2 border-gray-300 rounded-lg">
      <div className="space-y-4">
        <div>
          <h2 className="text-3xl font-semibold">Daniel Ejike</h2>
          <p>10-9-2024</p>
        </div>
        <div className="fill-[#FFDD55]">
          <Ratings value={4.5} variant="yellow" />
        </div>
        <div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa odio
          aspernatur aliquam saepe, vel voluptate voluptas tenetur ipsum iure
          quam recusandae doloremque quis enim nam corrupti aliquid minima.
          Numquam dolor alias ad saepe corporis iusto minus unde. Velit ratione
          atque voluptas minus, qui necessitatibus, ab tempora saepe illo nisi
          maiores quasi fugit repellendus, a sit tempore ea obcaecati debitis
          libero autem minima rerum cupiditate.
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
