import React, { useState, useEffect } from 'react';
import { format, startOfWeek, add, sub, getYear, getMonth, isToday, isPast, isSameDay } from 'date-fns';
import { IoChevronBack, IoChevronForward, } from 'react-icons/io5';
import { RxAvatar, } from 'react-icons/rx';
import { doc, getDoc, addDoc, collection, query, where, getDocs, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../Firebase";
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth";

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat'];

function AdminCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date()); //current date 
    const [modalIsOpen, setModalIsOpen] = useState(false); //triggering the modal
    const [selectedDate, setSelectedDate] = useState(null); //selecting a date
    const currentMonth = format(currentDate, 'MMMM'); //current month
    const currentYear = getYear(currentDate); //current year
    const startOfGrid = startOfWeek(currentDate, { weekStartsOn: 0 }); //grid layout
    const [user] = useAuthState(auth); //user name
    const [displayName, setDisplayName] = useState(''); //getting user name
    const [numSamples, setNumSamples] = useState(''); //number field
    const [time, setTime] = useState(''); //time field
    const [note, setNote] = useState(''); //string field
    const [appointments, setAppointments] = useState([]); //managing appointments
    const [appointmentModalIsOpen, setAppointmentModalIsOpen] = useState(false); //selcting the saved appointments
    const [selectedAppointment, setSelectedAppointment] = useState(null); //selecting appointments
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/admin-login');
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };


    //fetching and displaying user name
    useEffect(() => {
        if (user) {
            const fetchUserData = async () => {
                const docRef = doc(db, 'admins', user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setDisplayName(`${data.firstName} ${data.lastName}`);
                }
            };

            fetchUserData();
        }
    }, [user]);

    //generating grid layout
    const generateGrid = () => {
        const grid = [];
        let day = startOfGrid;

        for (let i = 0; i < 42; i++) {
            grid.push(day);
            day = add(day, { days: 1 });
        }

        return grid;
    };

    const grid = generateGrid();

    //click to go back and view previous months
    const handlePrevMonth = () => {
        setCurrentDate(sub(currentDate, { months: 1 }));
    };

    //click to go next and view next months
    const handleNextMonth = () => {
        setCurrentDate(add(currentDate, { months: 1 }));
    };

    //modal for saving appoinment
    const openModal = (date) => {
        setSelectedDate(date);
        setModalIsOpen(true);
    };

    //closing that modal
    const closeModal = () => {
        setModalIsOpen(false);
    };

    //saving appoinment in firebase
    const saveAppointment = async () => {
        try {
            const appointmentData = {
                userId: user.uid,
                date: selectedDate,
                numSamples: parseInt(numSamples),
                time: time,
                note: note,
                status: 'pending'
            };
            const docRef = await addDoc(collection(db, "appointments"), appointmentData);
            return docRef; // Add this line
        } catch (error) {
            console.error("Error adding appointment: ", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newAppointmentDocRef = await saveAppointment();
        const newAppointmentDocSnap = await getDoc(newAppointmentDocRef);
        const newAppointmentData = {
            id: newAppointmentDocRef.id,
            ...newAppointmentDocSnap.data(),
        };
        setAppointments([...appointments, newAppointmentData]);
        closeModal();
    };

    useEffect(() => {
        const fetchAppointments = async () => {
            const q = collection(db, "appointments");
            const querySnapshot = await getDocs(q);
            const appointmentList = [];
            querySnapshot.forEach((doc) => {
                appointmentList.push({ id: doc.id, ...doc.data() });
            });
            setAppointments(appointmentList);
        };
        fetchAppointments();
    }, []);

    const updateAppointmentStatus = async (status) => {
        try {
            if (selectedAppointment) {
                const appointmentRef = doc(db, "appointments", selectedAppointment.id);
                await updateDoc(appointmentRef, { status });
                setAppointments(appointments.map(a => a.id === selectedAppointment.id ? { ...a, status } : a));
                closeAppointmentModal();
            }
        } catch (error) {
            console.error("Error updating appointment: ", error);
        }
    };

    const getAppointmentsForDate = (date) => {
        return appointments.filter(appointment => isSameDay(appointment.date.toDate(), date)).map(appointment => ({
            ...appointment,
            status: appointment.status
        }));
    };

    const handleAppointmentClick = (appointment, event) => {
        event.stopPropagation();
        setSelectedAppointment(appointment);
        setAppointmentModalIsOpen(true);
    };

    const closeAppointmentModal = () => {
        setAppointmentModalIsOpen(false);
    };

    const cancelAppointment = async () => {
        try {
            if (selectedAppointment) {
                const appointmentRef = doc(db, "appointments", selectedAppointment.id);
                await deleteDoc(appointmentRef);
                setAppointments(appointments.filter(a => a.id !== selectedAppointment.id));
                closeAppointmentModal();
            }
        } catch (error) {
            console.error("Error deleting appointment: ", error);
        }
    };

    return (
        <div className="min-h-screen bg-white flex">
            <div className="flex-grow flex flex-col">
                <header className="text-gray-700 text-center py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex justify-start items-center px-4">
                            <IoChevronBack onClick={handlePrevMonth} className="text-3xl cursor-pointer" />
                            <IoChevronForward onClick={handleNextMonth} className="text-3xl cursor-pointer" />
                            <h1 className="text-2xl">{`${currentMonth} ${currentYear}`}</h1>
                        </div>
                        <div className="relative flex justify-start items-center px-4 gap-2">
                            <h1
                                className="text-lg font-normal"
                                onClick={() => setDropdownVisible(!dropdownVisible)}
                            >
                                Hi, {displayName}
                            </h1>
                            <RxAvatar
                                className="text-3xl cursor-pointer"
                                onClick={() => setDropdownVisible(!dropdownVisible)}
                            />
                            {dropdownVisible && (
                                <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded shadow-lg p-2">
                                    <button
                                        className="text-left w-full text-black"
                                        type="button"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>
                <div className="flex-grow grid grid-cols-7 p-4">
                    {grid.map((day, index) => (
                        <div
                            key={index}
                            className={`text-center py-2 ${getMonth(day) === getMonth(currentDate) ? 'bg-white text-black border border-gray-200 text-sm' : 'bg-white text-gray-600 border border-gray-200 text-xs'
                                } ${!isPast(day) && 'cursor-pointer'}`}
                            onClick={!isPast(day) ? () => openModal(day) : undefined}
                        >
                            {index < 7 ? (
                                <div className="text-sm text-center py-1 mb-1">
                                    {daysOfWeek[index]}
                                </div>
                            ) : null}
                            <span
                                className={`inline-block ${isToday(day) ? 'bg-blue-500 text-white rounded-full w-7 h-7 p-1' : ''
                                    }`}
                            >
                                {format(day, 'd')}
                            </span>
                            {getAppointmentsForDate(day).map(appointment => (
                                <div
                                    key={appointment.id}
                                    className={`mt-2 px-2 py-1 rounded ${appointment.status === "approved"
                                        ? "bg-green-500 text-white"
                                        : appointment.status === "rejected"
                                            ? "bg-red-500 text-white"
                                            : "bg-orange-500 text-white"
                                        }`}

                                    onClick={(event) => handleAppointmentClick(appointment, event)}
                                >
                                    {appointment.time}
                                </div>
                            ))}
                            <Modal
                                isOpen={appointmentModalIsOpen}
                                onRequestClose={closeAppointmentModal}
                                contentLabel="Appointment Details Modal"
                                className="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 mx-auto mt-16 overflow-auto bg-white p-10 rounded-lg shadow-xl"
                            >
                                {selectedAppointment && (
                                    <>
                                        <h2 className="text-2xl mb-4">
                                            Appointment Details for {format(selectedAppointment.date.toDate(), 'PPP')}
                                        </h2>
                                        <div>
                                            <p>Time: {selectedAppointment.time}</p>
                                            <p>Number of samples: {selectedAppointment.numSamples}</p>
                                            <p>Note: {selectedAppointment.note}</p>
                                            <p>Status: {selectedAppointment.status}</p>
                                        </div>
                                        <div className="flex justify-end space-x-4">
                                            <button
                                                className="bg-green-500 rounded-md text-white p-2 w-20"
                                                type="button"
                                                onClick={() => updateAppointmentStatus('approved')}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className="bg-red-500 rounded-md text-white p-2 w-20"
                                                type="button"
                                                onClick={() => updateAppointmentStatus('rejected')}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                        <button
                                            className="bg-sky-600 rounded-md text-white p-2 mt-4"
                                            type="button"
                                            onClick={closeAppointmentModal}
                                        >
                                            Close
                                        </button>
                                    </>
                                )}
                            </Modal>
                        </div>
                    ))}
                </div>
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Appointment Modal"
                    className="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 mx-auto mt-16 overflow-auto bg-white p-10 rounded-lg shadow-xl"
                >
                    {selectedDate && <h2 className="text-2xl mb-4">Set Appointment for {format(selectedDate, 'PPP')}</h2>}
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col justify-center">
                            <label>
                                Number of samples:
                                <input className="appearance-none rounded-none relative block w-72 bg-transparent py-2 border-b
                                 border-zinc-950 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none 
                                 focus:ring-sky-500 focus:border-sky-500 focus:z-10 sm:text-sm"
                                    value={numSamples} onChange={e => setNumSamples(e.target.value)}
                                    type="number"
                                    min="1" required
                                />
                            </label>
                            <br />
                            <label>
                                Time:
                                <input className="appearance-none rounded-none relative block w-72 bg-transparent py-2 border-b
                                 border-zinc-950 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none 
                                 focus:ring-sky-500 focus:border-sky-500 focus:z-10 sm:text-sm"
                                    value={time} onChange={e => setTime(e.target.value)}
                                    type="time" required
                                />
                            </label>
                            <br />
                            <label>
                                Note:
                                <input className="appearance-none rounded-none relative block w-72 bg-transparent py-2 border-b
                                 border-zinc-950 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none 
                                 focus:ring-sky-500 focus:border-sky-500 focus:z-10 sm:text-sm"
                                    value={note} onChange={e => setNote(e.target.value)}
                                    type="text"
                                />
                            </label>
                            <br />
                            <div className="flex flex-row justify-between">
                                <button className=" bg-rose-500 rounded-md text-white p-2 w-20" type="button" onClick={closeModal}>Cancel</button>
                                <button className="bg-sky-600 rounded-md text-white p-2 w-20" type="submit">Save</button>
                            </div>
                        </div>
                    </form>
                </Modal>

            </div>
        </div>
    );

}

export default AdminCalendar;
