import SideBar from "./sideBar";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./sideBar.css";
import "./Fees.css";

function Fees() {
  const [showForm, setShowForm] = useState(false);
  const [fees, setFees] = useState([]);
  const [cases, setCases] = useState([]);
  const [editingFee, setEditingFee] = useState(null);

  // Auto-populated fields from the matched case
  const [linkedCase, setLinkedCase] = useState(null);
  const [caseRefInput, setCaseRefInput] = useState("");
  const lookupTimeout = useRef(null);

  useEffect(() => {
    fetchFees();
    fetchCases();
  }, []);

  const fetchFees = async () => {
    try {
      const response = await axios.get("https://juristiq.onrender.com/getfees", {
        withCredentials: true,
      });
      setFees(response.data);
    } catch (error) {
      console.error("Error fetching fees:", error);
      setFees([]);
    }
  };

  const fetchCases = async () => {
    try {
      const response = await axios.get("https://juristiq.onrender.com/getcases", {
        withCredentials: true,
      });
      setCases(response.data);
    } catch (error) {
      console.error("Error fetching cases:", error);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
  };

  const handleClick = () => {
    setShowForm(!showForm);
    setEditingFee(null);
    setLinkedCase(null);
    setCaseRefInput("");
  };

  const handleEdit = (fee) => {
    setEditingFee(fee);
    setLinkedCase(null); // editing uses stored values directly
    setCaseRefInput("");
    setShowForm(true);
  };

  // When user types a case ref number, look it up from already-fetched cases
  const handleCaseRefChange = (e) => {
    const val = e.target.value;
    setCaseRefInput(val);
    setLinkedCase(null);

    clearTimeout(lookupTimeout.current);
    if (!val) return;

    // Debounce slightly so we don't re-search on every keystroke
    lookupTimeout.current = setTimeout(() => {
      const match = cases.find(
        (c) => String(c.case_ref_no) === String(val.trim())
      );
      setLinkedCase(match || null);
    }, 300);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const totalFees = Number(formData.get("totalFees"));
    const amountPaid = Number(formData.get("amountPaid"));
    const pendingFees = totalFees - amountPaid;

    const feeData = {
      case_ref_no: formData.get("case_ref_no"),
      clientName: formData.get("clientName"),
      fees: totalFees,
      amount_paid: amountPaid,
      pending_fees: pendingFees,
      payment_mode: formData.get("mode"),
      due_date: formData.get("duedate"),
      remarks: formData.get("remarks"),
    };

    try {
      if (editingFee) {
        await axios.put(
          `https://juristiq.onrender.com/updatefee/${editingFee._id}`,
          feeData
        );
      } else {
        await axios.post("https://juristiq.onrender.com/createfee", feeData, {
          withCredentials: true,
        });
      }
      setShowForm(false);
      setEditingFee(null);
      setLinkedCase(null);
      setCaseRefInput("");
      fetchFees();
    } catch (error) {
      console.error("Error processing fee record:", error);
      const msg =
        error.response?.data?.message || "Error processing request. Try again.";
      alert(msg);
    }
  };

  const handleDelete = async (fee) => {
    if (!window.confirm("Are you sure you want to delete this fee record?")) return;
    try {
      await axios.delete(`https://juristiq.onrender.com/deletefee/${fee._id}`);
      fetchFees();
    } catch (error) {
      console.error("Error deleting fee record:", error);
      alert("Failed to delete record. Try again.");
    }
  };

  // Derived values shown in the form when a case is linked
  const autoClientName = linkedCase?.clientName || "";
  const autoTotalFees = linkedCase?.fees ?? "";
  // amount_paid is fees - pending_fees as stored on the case
  const autoAmountPaid =
    linkedCase != null
      ? linkedCase.fees - linkedCase.pending_fees
      : "";

  return (
    <div className="fee-management-container">
      <SideBar />
      <button onClick={handleClick} className="add-case-button">
        <svg
          className="plus-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="16"></line>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
        <span className="sr-only">Add Fee</span>
      </button>

      {showForm && (
        <>
          <div className="overlay" onClick={handleClick}></div>
          <div className="case-form">
            <form className="case-box" onSubmit={handleFormSubmit}>

              <label>Case No:</label>
              {editingFee ? (
                <input
                  type="text"
                  name="case_ref_no"
                  defaultValue={editingFee.case_ref_no}
                  readOnly
                />
              ) : (
                <input
                  type="text"
                  name="case_ref_no"
                  value={caseRefInput}
                  onChange={handleCaseRefChange}
                  placeholder="Enter case ref no."
                  required
                />
              )}

              {/* Show a hint when a case is found or not found */}
              {!editingFee && caseRefInput && (
                <p className={`case-lookup-hint ${linkedCase ? "found" : "not-found"}`}>
                  {linkedCase
                    ? `✓ Case found: ${linkedCase.caseTitle}`
                    : "⚠ No matching case — fill details manually"}
                </p>
              )}

              <label>Client Name:</label>
              <input
                type="text"
                name="clientName"
                value={editingFee ? undefined : undefined}
                defaultValue={editingFee?.clientName || autoClientName}
                key={`clientName-${linkedCase?._id || "none"}-${editingFee?._id || "new"}`}
                readOnly={!!linkedCase}
                required
              />

              <label>Total Fees:</label>
              <input
                type="number"
                name="totalFees"
                min="0"
                defaultValue={editingFee?.fees ?? autoTotalFees}
                key={`totalFees-${linkedCase?._id || "none"}-${editingFee?._id || "new"}`}
                readOnly={!!linkedCase}
                required
              />

              <label>Amount Paid:</label>
              <input
                type="number"
                name="amountPaid"
                min="0"
                defaultValue={editingFee?.amount_paid ?? autoAmountPaid}
                key={`amountPaid-${linkedCase?._id || "none"}-${editingFee?._id || "new"}`}
                readOnly={!!linkedCase}
                required
              />

              {linkedCase && (
                <p className="case-lookup-hint found" style={{ marginTop: 0 }}>
                  Amount paid pulled from case record
                </p>
              )}

              <label>Payment Mode:</label>
              <select
                name="mode"
                defaultValue={editingFee?.payment_mode || "Cash"}
                required
              >
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Online">Online</option>
              </select>

              <label>Due Date:</label>
              <input
                type="date"
                name="duedate"
                defaultValue={formatDate(editingFee?.due_date)}
                required
              />

              <label>Remarks:</label>
              <textarea
                name="remarks"
                rows="3"
                defaultValue={editingFee?.remarks || ""}
              ></textarea>

              <button type="submit" className="submit-fee">
                {editingFee ? "Update" : "Submit"}
              </button>
            </form>
          </div>
        </>
      )}

      <div className={`fee-table-container ${showForm ? "hidden" : ""}`}>
        <table className="fee-table">
          <thead className="fee-thead">
            <tr>
              <th className="fee-th">Case No.</th>
              <th className="fee-th">Client Name</th>
              <th className="fee-th">Total Fees</th>
              <th className="fee-th">Amount Paid</th>
              <th className="fee-th">Pending Fees</th>
              <th className="fee-th">Payment Mode</th>
              <th className="fee-th">Due Date</th>
              <th className="fee-th">Remarks</th>
              <th className="fee-th">Actions</th>
            </tr>
          </thead>
          <tbody className="fee-tbody">
            {Array.isArray(fees) && fees.length > 0 ? (
              fees.map((fee) => (
                <tr key={fee._id}>
                  <td className="fee-td">{fee.case_ref_no}</td>
                  <td className="fee-td">{fee.clientName}</td>
                  <td className="fee-td">{fee.fees}</td>
                  <td className="fee-td">{fee.amount_paid}</td>
                  <td className="fee-td">{fee.pending_fees}</td>
                  <td className="fee-td">{fee.payment_mode}</td>
                  <td className="fee-td">{formatDate(fee.due_date)}</td>
                  <td className="fee-td">{fee.remarks}</td>
                  <td className="fee-td">
                    <button className="edit-fee-btn" onClick={() => handleEdit(fee)}>
                      Edit
                    </button>
                    <button className="delete-fee-btn" onClick={() => handleDelete(fee)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="fee-td" colSpan="9" style={{ textAlign: "center" }}>
                  No fee records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Fees;
