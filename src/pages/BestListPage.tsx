import ListForm2 from "../components/Forms/ListForm2";
import React from "react";

const BestListPage = () => {
  return (
    <>
      <div>
        <ListForm2 isBest={true} name={"베스트 도전 게시물"} />
      </div>
    </>
  );
};

export default BestListPage;
