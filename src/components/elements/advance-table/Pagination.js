import { Pagination } from "react-bootstrap";

const SPagination = ({
    previousPage,
    pageCount,
    pageIndex,
    gotoPage,
    nextPage,
    canPreviousPage,
    canNextPage
}) => {

    if (pageCount > 1) {
        let items = [];
        for (let number = 1; number <= pageCount; number++) {
            if (number === 1 || number === pageCount || (number >= pageIndex - 2 && number <= pageIndex + 2)) {
                items.push(
                    <Pagination.Item key={number} className="mx-1 bg-white" active={number - 1 === pageIndex} onClick={() => gotoPage(number - 1)}>
                        {number}
                    </Pagination.Item>,
                );
            } else if (number === 2 || number === pageCount - 1) {
                items.push(<Pagination.Ellipsis key={number} className="bg-white mx-1" />);
            }
        }

        return (
            <Pagination>
                <Pagination.Prev onClick={() => previousPage()} disabled={!canPreviousPage} className='me-1 bg-white' />
                {items}
                <Pagination.Next onClick={() => nextPage()} disabled={!canNextPage} className="ms-1 bg-white"/>
            </Pagination>
        );
    }
};

export default SPagination;
