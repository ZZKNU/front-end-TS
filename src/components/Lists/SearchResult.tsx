import { addFriends } from "../../apis/api";
import Modal from "../Modals/Modal";
import React from "react";

// Define the type for each search result item
interface SearchResultItem {
  id: number;
  nickName: string;
}

// Define the props type for the SearchResult component
interface SearchResultProps {
  isOpen: boolean;
  onClose: () => void;
  searchResults: SearchResultItem[] | null;
}

const SearchResult: React.FC<SearchResultProps> = ({
  isOpen,
  onClose,
  searchResults,
}) => {
  const addFriendHandler = async (id: number) => {
    try {
      const res = await addFriends({ friend_id: id });
      onClose();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Search Result">
      <div className="space-y-2">
        {searchResults && searchResults.length > 0 ? (
          searchResults.map((result) => (
            <div key={result.id} className="result-item">
              <p>
                <strong>Nickname:</strong>{" "}
                <span className="ms-12">{result.nickName}</span>
                <button
                  className="btn btn-primary ms-12"
                  onClick={() => addFriendHandler(result.id)}
                >
                  친구 추가
                </button>
              </p>
            </div>
          ))
        ) : (
          <p>검색 결과가 없습니다.</p>
        )}
      </div>
    </Modal>
  );
};

export default SearchResult;
