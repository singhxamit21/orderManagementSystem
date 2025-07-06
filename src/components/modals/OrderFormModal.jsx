import React, { useState, useCallback, useMemo } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import Select from "react-select";



const OrderFormModal = ({ show, onSubmit, skuList, setShowOrderModal }) => {

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        country: "",
        items: [],
    });

    const [errors, setErrors] = useState({});

    const skuOptions = useMemo(
        () =>
            skuList.map((sku) => ({
                label: `${sku.name} (${sku.code})`,
                value: sku.code,
                sku,
            })),
        [skuList]
    );

    const totalAmount = useMemo(
        () => form.items.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2),
        [form.items]
    );

    const handleFieldChange = useCallback(
        (field) => (e) => {
            const value = e.target.value;
            setForm((prev) => ({ ...prev, [field]: value }));
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        },
        []
    );

    const addItem = useCallback((sku) => {
        setForm((prev) => {
            if (prev.items.find((i) => i.code === sku.code)) return prev;
            return {
                ...prev,
                items: [...prev.items, { ...sku, quantity: 1 }],
            };
        });
    }, []);

    const updateQty = useCallback((index, delta) => {
        setForm((prev) => {
            const items = prev.items.map((item, i) =>
                i === index
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            );
            return { ...prev, items };
        });
    }, []);

    const removeItem = useCallback((index) => {
        setForm((prev) => {
            const items = prev.items.filter((_, i) => i !== index);
            return { ...prev, items };
        });
    }, []);

    const validate = useCallback(() => {
        const errs = {};
        if (!form.fullName) errs.fullName = "Full name is required";
        if (!form.email || !/^[\w-.]+@[\w-]+\.\w+$/.test(form.email)) errs.email = "Valid email required";
        if (!form.phone || !/^\d{10}$/.test(form.phone)) errs.phone = "10-digit phone required";
        if (!form.address) errs.address = "Address required";
        if (!form.city) errs.city = "City required";
        if (!form.country) errs.country = "Country required";
        if (form.items.length === 0) errs.items = "At least one SKU required";

        setErrors(errs);
        return Object.keys(errs).length === 0;
    }, [form]);

    const handleClose = useCallback(() => {
        setShowOrderModal(false);
        setForm({
            fullName: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            country: "",
            items: [],
        });
        setErrors({});
    }, [setShowOrderModal]);

    const handleSubmit = useCallback(() => {
        if (!validate()) return;
        onSubmit({
            id: Math.floor(Math.random() * 100000),
            customer: form.fullName,
            total: totalAmount,
            createdAt: new Date(),
            status: "New",
            customerDetails: {
                email: form.email,
                phone: form.phone,
                address: form.address,
                city: form.city,
                country: form.country,
            },
            items: form.items,
        });
        handleClose();
    }, [validate, onSubmit, form, totalAmount, handleClose]);

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Create New Order</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row className="mb-2">
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control
                                    value={form.fullName}
                                    onChange={handleFieldChange("fullName")}
                                    isInvalid={!!errors.fullName}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.fullName}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    value={form.email}
                                    onChange={handleFieldChange("email")}
                                    isInvalid={!!errors.email}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.email}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-2">
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label>Phone</Form.Label>
                                <Form.Control
                                    value={form.phone}
                                    onChange={handleFieldChange("phone")}
                                    isInvalid={!!errors.phone}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.phone}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label>Address</Form.Label>
                                <Form.Control
                                    value={form.address}
                                    onChange={handleFieldChange("address")}
                                    isInvalid={!!errors.address}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.address}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-2">
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label>City</Form.Label>
                                <Form.Control
                                    value={form.city}
                                    onChange={handleFieldChange("city")}
                                    isInvalid={!!errors.city}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.city}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label>Country</Form.Label>
                                <Form.Control
                                    value={form.country}
                                    onChange={handleFieldChange("country")}
                                    isInvalid={!!errors.country}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.country}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-2">
                        <Form.Label>Select SKUs</Form.Label>
                        <Select
                            options={skuOptions}
                            onChange={(opt) => addItem(opt.sku)}
                            isSearchable
                        />
                        {errors.items && <div className="text-danger mt-1">{errors.items}</div>}
                    </Form.Group>

                    {form.items.map((item, i) => (
                        <Row key={item.code} className="align-items-center mb-2 border p-2 rounded">
                            <Col sm={3}>
                                <strong>{item.name}</strong>
                            </Col>
                            <Col sm={2}>
                                <small>{item.code}</small>
                            </Col>
                            <Col sm={2}>{item.price.toFixed(2)} CHF</Col>
                            <Col sm={3}>
                                <Button size="sm" variant="outline-secondary" onClick={() => updateQty(i, -1)}>
                                    -
                                </Button>
                                <span className="mx-2">{item.quantity}</span>
                                <Button size="sm" variant="outline-secondary" onClick={() => updateQty(i, 1)}>
                                    +
                                </Button>
                            </Col>
                            <Col sm={1}>
                                <strong>{(item.price * item.quantity).toFixed(2)}</strong>
                            </Col>
                            <Col sm={1}>
                                <Button size="sm" variant="outline-danger" onClick={() => removeItem(i)}>
                                    ×
                                </Button>
                            </Col>
                        </Row>
                    ))}

                    <hr />
                    <h5 className="text-end">Total: {totalAmount} CHF</h5>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Create Order
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default React.memo(OrderFormModal);
