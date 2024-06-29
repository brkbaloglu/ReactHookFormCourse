import { useForm, useFieldArray, FieldErrors } from "react-hook-form"
import { DevTool } from "@hookform/devtools"
import { useEffect } from "react"
// import { yupResolver } from "@hookform/resolvers/yup"
// import * as yup from "yup"

// const schema = yup.object({
//   username: yup.string().required("Username is required"),
//   email: yup.string().required("E-mail is required").email("E-mail format is not valid"),
//   channel: yup.string().required("Channel is required")
// })

let renderCount = 0

type FormValues = {
  username: string
  email: string
  channel: string
  social: {
    twitter: string
    facebook: string
  }
  phoneNumbers: string[]
  phNumbers: {
    number: string
  }[]
  age: number
  dob: Date
}

export default function YoutubeForm() {

  
  const form = useForm<FormValues>({
    defaultValues: async() => {
      // const response = await fetch("https://jsonplaceholder.typicode.com/users/1")
      // const data = await response.json()

      return {
        // username: data.name,
        username: "",
        // email: data.email,
        email: "",
        channel: "",
        social: {
          twitter: "",
          facebook: ""
        },
        phoneNumbers: ["", ""],
        phNumbers:[{number: ""}],
        age: 0,
        dob: new Date()
      } 
      
      // username: "",
      // email: "",
      // channel: ""
    },
    // resolver: yupResolver(schema),
    // mode: "onSubmit",
    mode: "onSubmit"
  })

  const { register, control, handleSubmit, formState, watch, getValues, setValue, reset, trigger} = form
  const {errors, touchedFields, dirtyFields, isDirty, isValid, isSubmitting, isSubmitted, isSubmitSuccessful, submitCount} = formState

  console.log({isSubmitting, isSubmitted, isSubmitSuccessful});

  console.log({submitCount});
  
  
  console.log({touchedFields, dirtyFields, isDirty, isValid});
  


  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    
  }

  // const watchUsername = watch("username")
  // const watchForm = watch()

  const { fields, append, remove } = useFieldArray({
    name: "phNumbers",
    control
  })


  useEffect(() => {
    const subscription = watch((value) => {
      console.log(value);
      
    })

    return () => subscription.unsubscribe()
  }, [watch])

  const handleGetValues = () => {
    console.log("Get values", getValues(["username"]));
    console.log("Get values", getValues());
    
  }

  const handleSetValue = () => {
    setValue("username", "", {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    })
  }

  const onError = (error: FieldErrors<FormValues>) => {
    console.log("Form errorss", error);
    
  }

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset()
    }
  }, [isSubmitSuccessful])

  renderCount++
  return (
    <div>
      <h1>Youtube Form ({renderCount / 2})</h1>
      {/* <h2>Watched value: {watchUsername}</h2> */}
      {/* <h2>Watch Form: {JSON.stringify(watchForm)}</h2> */}
        <form style={{display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }} noValidate action="" onSubmit={handleSubmit(onSubmit, onError)}>
            <div>
            <label htmlFor="username">Username</label>
            <input type="text" id="username" {...register("username", {
              required:{
                value: true,
                message: "Username is required"
              }
            })} />
            </div>
            <p className="error">{errors.username?.message}</p>
            <div>
            <label htmlFor="email">E-mail</label>
            <input type="email" {...register("email", {
              pattern: {
                value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                message: "Invalid email format"
              },
              validate: {
                notAdmin: (fieldValue) => {
                  return fieldValue !== "admin@example.com" || "Enter a different email address"
                },
                notBlackListed: (fieldValue) => {
                  return !fieldValue.endsWith("baddomain.com") || "This domain is not supported"
                },
                emailAvailable: async(fieldValue) => {
                  const response = await fetch(`https://jsonplaceholder.typicode.com/users?email=${fieldValue}`)
                  const data = await response.json()
                  return data.length == 0 || "E-mail already exists"
                }
              }
            })} id="email" />
            </div>
            <p className="error">{errors.email?.message}</p>

            <div>
            <label htmlFor="channel">Channel</label>
            <input type="text" {...register("channel")} id="channel" />
           
            </div>
            <p className="error">{errors.channel?.message}</p>

            <div>
            <label htmlFor="twitter">Twitter</label>
            <input type="text" {...register("social.twitter")} id="twitter" />
            </div>
            <p className="error">{errors.social?.twitter?.message}</p>

           <div>
           <label htmlFor="facebook">Facebook</label>
            <input type="text" {...register("social.facebook")} id="facebook" />
           </div>
           <p className="error">{errors.social?.facebook?.message}</p>

            <div>
            <label htmlFor="primary-phone">Phone Number 1</label>
            <input type="text" {...register("phoneNumbers.0")} id="primary-phone" />
            </div>
            <p className="error">{errors.phoneNumbers?.message}</p>

            <div>
            <label htmlFor="secondary-phone">Phone Number 2</label>
            <input type="text" {...register("phoneNumbers.1")} id="secondary-phone" />
            </div>
            <p className="error">{errors.phoneNumbers?.message}</p>

            <div>
              <label htmlFor="">List of phone numbers</label>
              {
                fields.map((field, index) => (
                  <div key={index}>
                    <input type="text" {...register(`phNumbers.${index}.number` as const )} name="" id="" />
                    {
                      index >= 0 && 
                      <button type="button" onClick={() => remove(index)}>Remove phone number</button>

                    }
                  </div>
                ))
              }

              <button type="button" onClick={() => append({number: ""})}>Add phone number</button>
            </div>


            <div>
            <label htmlFor="age">Age</label>
            <input type="number" {...register("age", {
              valueAsNumber: true,
              required: {
                value: true,
                message: "Age is required"
              }
            })} id="age" />
            </div>
            <p className="error">{errors.age?.message}</p>


            <div>
            <label htmlFor="dob">Date of Birth</label>
            <input type="date" {...register("dob", {
              valueAsDate: true,
              required: {
                value: true,
                message: "Date of birth is required"
              }
            })} id="dob" />
            </div>
            <p className="error">{errors.dob?.message}</p>

            <button disabled={!isDirty || !isValid || isSubmitting}>Submit</button>
            <button onClick={() => reset()}>Reset</button>
            <button onClick={handleGetValues}>Get values</button>
            <button onClick={handleSetValue}>Set value</button>
            {/* <button onClick={() => trigger()}>Validate</button> */}
            <button onClick={() => trigger("channel")}>Validate</button>
        </form>
        <DevTool control={control}></DevTool>
    </div>
  )
}
