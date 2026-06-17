import SideBar from "./sideBar"
import { useState, useEffect } from "react"
import axios from "axios"
import "./sideBar.css"
import "./Mycases.css"

function MyCases() {
  const [showForm, setShowForm] = useState(false)
  const [cases, setCases] = useState([])
  const [editingCase, setEditingCase] = useState(null)

  useEffect(() => {
    fetchCases()
  }, [])

  const fetchCases = async () => {
    try {
      const response = await axios.get("https://juristiq.onrender.com/getcases", {
        withCredentials: true,
      })
      setCases(response.data)
    } catch (error) {
      console.error("Error fetching cases:", error.response?.data || error)
      setCases([])
    }
  }

  const handleClick = () => {
    setShowForm(!showForm)
    setEditingCase(null)
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    const totalFees = Number(formData.get("totalFees"))
    const amountPaid = Number(formData.get("amountPaid"))
    const pendingFees = totalFees - amountPaid

    if (editingCase) {
      // updatecase only needs these fields (no phone, no amount_paid)
      const updatePayload = {
        caseTitle: formData.get("caseTitle"),
        clientName: formData.get("clientName"),
        status: formData.get("status"),
        nextHearing: formData.get("hearingDate")
          ? new Date(formData.get("hearingDate")).toISOString()
          : null,
        fees: totalFees,
        pending_fees: pendingFees,
      }

      if (!updatePayload.caseTitle || !updatePayload.clientName || !updatePayload.status) {
        alert("Please fill all the required fields.")
        return
      }

      try {
        await axios.put(
          `https://juristiq.onrender.com/updatecase/${editingCase.case_ref_no}`,
          updatePayload
        )
        e.target.reset()
        setEditingCase(null)
        setShowForm(false)
        fetchCases()
      } catch (error) {
        console.error("Error updating case:", error)
        alert("Error updating case. Try again.")
      }
    } else {
      // createcase requires: case_ref_no, caseTitle, clientName, phone, status, nextHearing, fees, pending_fees
      const newCase = {
        case_ref_no: Number(formData.get("case_ref_no")),
        caseTitle: formData.get("caseTitle"),
        clientName: formData.get("clientName"),
        phone: formData.get("phone"),
        status: formData.get("status"),
        nextHearing: formData.get("hearingDate")
          ? new Date(formData.get("hearingDate")).toISOString()
          : null,
        fees: totalFees,
        pending_fees: pendingFees,
      }

      if (!newCase.case_ref_no || !newCase.caseTitle || !newCase.clientName || !newCase.phone || !newCase.status) {
        alert("Please fill all the required fields.")
        return
      }

      try {
        await axios.post("https://juristiq.onrender.com/createcase", newCase, {
          withCredentials: true,
        })
        e.target.reset()
        setEditingCase(null)
        setShowForm(false)
        fetchCases()
      } catch (error) {
        console.error("Error creating case:", error)
        const msg = error.response?.data?.message || "Error adding case. Try again."
        alert(msg)
      }
    }
  }

  const handleDelete = async (case_ref_no) => {
    if (!window.confirm("Are you sure you want to delete this case?")) return
    try {
      await axios.delete(`https://juristiq.onrender.com/deletecase/${case_ref_no}`)
      fetchCases()
    } catch (error) {
      console.error("Error deleting case:", error)
      alert("Failed to delete case. Try again.")
    }
  }

  const handleEdit = (caseItem) => {
    setEditingCase(caseItem)
    setShowForm(true)
  }

  return (
    <div className="case-management-container">
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
        <span className="sr-only">Add case</span>
      </button>

      {showForm && (
        <>
          <div className="overlay" onClick={handleClick}></div>
          <div className="case-form">
            <form className="case-box" onSubmit={handleFormSubmit}>
              <label>Case Ref No.:</label>
              <input
                type="number"
                name="case_ref_no"
                required
                defaultValue={editingCase?.case_ref_no}
                readOnly={!!editingCase}
              />

              <label>Case Title:</label>
              <input type="text" name="caseTitle" required defaultValue={editingCase?.caseTitle} />

              <label>Client Name:</label>
              <input type="text" name="clientName" required defaultValue={editingCase?.clientName} />

              {/* Phone only needed when creating a new case (to create the client record) */}
              {!editingCase && (
                <>
                  <label>Client Phone:</label>
                  <input type="tel" name="phone" required placeholder="e.g. 9876543210" />
                </>
              )}

              <label>Status:</label>
              <select name="status" required defaultValue={editingCase?.status}>
                <option value="Pending">Pending</option>
                <option value="Active">Active</option>
                <option value="Closed">Closed</option>
                <option value="Won">Won</option>
              </select>

              <label>Next Hearing:</label>
              <input
                type="date"
                name="hearingDate"
                required
                defaultValue={
                  editingCase?.nextHearing
                    ? new Date(editingCase.nextHearing).toISOString().split("T")[0]
                    : ""
                }
              />

              <label>Total Fees:</label>
              <input type="number" name="totalFees" min="0" required defaultValue={editingCase?.fees} />

              <label>Amount Paid:</label>
              <input
                type="number"
                name="amountPaid"
                min="0"
                required
                defaultValue={
                  editingCase
                    ? editingCase.fees - editingCase.pending_fees
                    : ""
                }
              />

              <button className="submit-case" type="submit">
                {editingCase ? "Update" : "Submit"}
              </button>
            </form>
          </div>
        </>
      )}

      <div className={`table-container ${showForm ? "hidden" : ""}`}>
        <table>
          <thead>
            <tr>
              <th>Case No.</th>
              <th>Case Title</th>
              <th>Client Name</th>
              <th>Status</th>
              <th>Next Hearing</th>
              <th>Total Fees</th>
              <th>Pending Fees</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(cases) && cases.length > 0 ? (
              cases.map((caseItem, index) => (
                <tr key={index}>
                  <td>{caseItem.case_ref_no}</td>
                  <td>{caseItem.caseTitle}</td>
                  <td>{caseItem.clientName}</td>
                  <td>{caseItem.status}</td>
                  <td>
                    {caseItem.nextHearing
                      ? new Date(caseItem.nextHearing).toLocaleDateString("en-GB")
                      : "N/A"}
                  </td>
                  <td>{caseItem.fees}</td>
                  <td>{caseItem.pending_fees}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(caseItem)}>
                      Update
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(caseItem.case_ref_no)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No cases available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MyCases
