import { Skeleton } from "@mui/material";

function Loader() {
  return (
    <div className="h-screen w-full">
      <Skeleton
        animation="wave"
        className="mb-10"
        variant="rectangular"
        width={"100%"}
        height={60}
      />
      <div className="flex h-[calc(100%-60px)]">
        <Skeleton
          animation="wave"
          variant="rectangular"
          className="w-[150px]"
          height={"100%"}
        />
        <Skeleton
          animation="wave"
          variant="rounded"
          className="ml-[50px] w-[calc(100vw-120px)]"
          height={"100%"}
        />
      </div>
    </div>
  );
}

export default Loader;
