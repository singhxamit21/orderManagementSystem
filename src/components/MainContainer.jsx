import React, {
    useEffect,
    useMemo,
    useState,
    useCallback,
} from "react";
import {
    Button,
    ButtonGroup,
    Col,
    Container,
    Form,
    Row,
    Pagination,
} from "react-bootstrap";
import { dummyOrders, dummySkus } from "./data/dummySkus";
import OrderFormModal from "./modals/OrderFormModal";
import ConformationModal from "./modals/ConformationModal";
import GenericToast from "./Toast/GenericToast";
import GenericTable from "./GenericTable";
import {
    DEFAULT_STATUS,
    DEFAULT_TABLE_ORDER,
    PAGE_SIZE,
    STATUSES,
} from "./constants";
import PageTitle from "./PageTitle";

const MemoizedGenericTable = React.memo(GenericTable);
const MemoizedOrderFormModal = React.memo(OrderFormModal);
const MemoizedConformationModal = React.memo(ConformationModal);
const MemoizedPageTitle = React.memo(PageTitle);

export default function MainContainer() {

    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState(DEFAULT_STATUS);
    const [sortOrder, setSortOrder] = useState(DEFAULT_TABLE_ORDER);
    const [page, setPage] = useState(1);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [confirm, setConfirm] = useState({ open: false, ids: [], target: null });
    const [showToast, setShowToast] = useState(false);

  
    useEffect(() => {
        const t = setTimeout(() => setOrders(dummyOrders), 300);
        return () => clearTimeout(t);
    }, []);


    useEffect(() => {
        setPage(1);
    }, [search, statusFilter, sortOrder]);


    const { filtered, paginated, totalPages } = useMemo(() => {
        const term = search.toLowerCase();

        const filteredData = orders
            .filter((order) => {
                const matchesStatus = statusFilter === "All" || order.status === statusFilter;
                const matchesSearch =
                    order.customer.toLowerCase().includes(term) || order.id.toString().includes(term);
                return matchesStatus && matchesSearch;
            })
            .sort((a, b) =>
                sortOrder === "ASC"
                    ? new Date(a.createdAt) - new Date(b.createdAt)
                    : new Date(b.createdAt) - new Date(a.createdAt)
            );

        const first = (page - 1) * PAGE_SIZE;
        const last = first + PAGE_SIZE;

        return {
            filtered: filteredData,
            paginated: filteredData.slice(first, last),
            totalPages: Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE)),
        };
    }, [orders, search, statusFilter, sortOrder, page]);

    useEffect(() => {
        if (page > totalPages) setPage(totalPages);
    }, [totalPages, page]);

    const allVisibleIds = useMemo(() => paginated.map((o) => o.id), [paginated]);

    const allVisibleSelected = useMemo(
        () => allVisibleIds.every((id) => selectedIds.has(id)),
        [allVisibleIds, selectedIds]
    );

    const someVisibleSelected = useMemo(
        () => allVisibleIds.some((id) => selectedIds.has(id)) && !allVisibleSelected,
        [allVisibleIds, selectedIds, allVisibleSelected]
    );

    const toggleOne = useCallback((id) => {
        setSelectedIds((prev) => {
            const nxt = new Set(prev);
            nxt.has(id) ? nxt.delete(id) : nxt.add(id);
            return nxt;
        });
    }, []);

    const toggleAllVisible = useCallback(() => {
        setSelectedIds((prev) => {
            const nxt = new Set(prev);
            if (allVisibleSelected) {
                allVisibleIds.forEach((id) => nxt.delete(id));
            } else {
                allVisibleIds.forEach((id) => nxt.add(id));
            }
            return nxt;
        });
    }, [allVisibleIds, allVisibleSelected]);

    const openConfirm = useCallback((ids, target) => setConfirm({ open: true, ids, target }), []);

    const handleBulk = useCallback(
        (target) => {
            if (selectedIds.size === 0) return setShowToast(true);
            openConfirm([...selectedIds], target);
        },
        [selectedIds, openConfirm]
    );

    const handleSingle = useCallback((id, target) => openConfirm([id], target), [openConfirm]);

    const applyStatus = useCallback(() => {
        setOrders((prev) =>
            prev.map((o) => (confirm.ids.includes(o.id) ? { ...o, status: confirm.target } : o))
        );
        setSelectedIds(new Set());
        setConfirm({ open: false, ids: [], target: null });
    }, [confirm]);

    const pagination = useMemo(() => {
        if (totalPages === 1) return null;

        const items = [];
        items.push(
            <Pagination.Prev
                key="prev"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
            />
        );

        const WINDOW = 2;
        const start = Math.max(1, page - WINDOW);
        const end = Math.min(totalPages, page + WINDOW);

        if (start > 1) {
            items.push(
                <Pagination.Item key={1} active={page === 1} onClick={() => setPage(1)}>
                    1
                </Pagination.Item>
            );
            if (start > 2) items.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
        }

        for (let p = start; p <= end; p++) {
            items.push(
                <Pagination.Item key={p} active={p === page} onClick={() => setPage(p)}>
                    {p}
                </Pagination.Item>
            );
        }

        if (end < totalPages) {
            if (end < totalPages - 1) items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
            items.push(
                <Pagination.Item
                    key={totalPages}
                    active={page === totalPages}
                    onClick={() => setPage(totalPages)}
                >
                    {totalPages}
                </Pagination.Item>
            );
        }

        items.push(
            <Pagination.Next
                key="next"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            />
        );

        return (
            <Pagination className="justify-content-end mt-3 my-3" size="sm">
                {items}
            </Pagination>
        );
    }, [page, totalPages]);

    return (
        <Container fluid className="py-3">
             <MemoizedPageTitle
                title="SKU Management"
                subtitle="Track and manage customer orders efficiently."
            />
            <Row className="gy-2 mb-3">
                <Col sm={3}>
                    <Form.Control
                        type="search"
                        placeholder="Search by Order ID or Customer Name"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </Col>

                <Col sm={2}>
                    <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="All">Status: All</option>
                        {STATUSES.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </Form.Select>
                </Col>

                <Col sm={2}>
                    <ButtonGroup>
                        <Button
                            variant={sortOrder === "ASC" ? "primary" : "outline-primary"}
                            onClick={() => setSortOrder("ASC")}
                        >
                            Sort ASC
                        </Button>
                        <Button
                            variant={sortOrder === "DESC" ? "primary" : "outline-primary"}
                            onClick={() => setSortOrder("DESC")}
                        >
                            Sort DESC
                        </Button>
                    </ButtonGroup>
                </Col>

                <Col sm="auto" className="ms-auto">
                    <ButtonGroup>
                        <Button variant="outline-success" onClick={() => handleBulk("Delivered")}>
                            Mark as Delivered
                        </Button>
                        <Button variant="outline-danger" onClick={() => handleBulk("Cancelled")}>
                            Mark as Cancelled
                        </Button>
                    </ButtonGroup>
                </Col>

                <Col sm={2}>
                    <Button className="mb-3" onClick={() => setShowOrderModal(true)}>
                        + Create Order
                    </Button>
                </Col>
            </Row>

            <MemoizedGenericTable
                orders={paginated}
                selectedIds={selectedIds}
                allVisibleSelected={allVisibleSelected}
                someVisibleSelected={someVisibleSelected}
                toggleOne={toggleOne}
                toggleAllVisible={toggleAllVisible}
                handleSingle={handleSingle}
            />

            {pagination}

            <MemoizedConformationModal confirm={confirm} setConfirm={setConfirm} applyStatus={applyStatus} />

            <MemoizedOrderFormModal
                show={showOrderModal}
                setShowOrderModal={setShowOrderModal}
                onSubmit={(newOrder) => setOrders((prev) => [...prev, newOrder])}
                skuList={dummySkus}
            />

            <GenericToast
                bg="warning"
                showToast={showToast}
                setShowToast={setShowToast}
                msg={"No order selected"}
            />
        </Container>
    );
}
