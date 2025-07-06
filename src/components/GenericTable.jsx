import React from "react";
import { Badge, Button, Form, Table } from "react-bootstrap";

export default function GenericTable({
    orders,
    selectedIds,
    allVisibleSelected,
    someVisibleSelected,
    toggleOne,
    toggleAllVisible,
    handleSingle,
}) {
    const StatusBadge = ({ status }) => {
        const color = { New: "warning", Delivered: "success", Cancelled: "danger" }[status] ?? "secondary";
        return <Badge bg={color}>{status}</Badge>;
    };

    return (
        <div className="border rounded" style={{ overflowX: "auto", height: "32rem" }}>
            <Table hover responsive className="mb-0">
                <thead className="table-light">
                    <tr>
                        <th>
                            <Form.Check
                                type="checkbox"
                                checked={allVisibleSelected}
                                ref={(el) => el && (el.indeterminate = someVisibleSelected)}
                                onChange={toggleAllVisible}
                            />
                        </th>
                        <th>Order ID</th>
                        <th>Customer Name</th>
                        <th>Total Amount</th>
                        <th>Created At</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>
                                <Form.Check
                                    type="checkbox"
                                    checked={selectedIds.has(order.id)}
                                    onChange={() => toggleOne(order.id)}
                                />
                            </td>
                            <td>{order.id}</td>
                            <td>{order.customer}</td>
                            <td>{order.total} CHF</td>
                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td>
                                <StatusBadge status={order.status} />
                            </td>
                            <td>
                                <Button
                                    size="sm"
                                    variant="outline-success"
                                    className="me-1"
                                    onClick={() => handleSingle(order.id, "Delivered")}
                                    disabled={order.status === "Delivered"}
                                >
                                    Deliver
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline-danger"
                                    onClick={() => handleSingle(order.id, "Cancelled")}
                                    disabled={order.status === "Cancelled"}
                                >
                                    Cancel
                                </Button>
                            </td>
                        </tr>
                    ))}
                    {orders.length === 0 && (
                        <tr>
                            <td colSpan="7" className="text-center text-muted">
                                No orders found
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
}
