import {constants} from './ej.widget.constants';

export class Events {
	fireEvent(element: Element, name: string, data? = {}) {
		let event = new CustomEvent(name, {
			detail: data,
			bubbles: true	
		});
		element.dispatchEvent(event);
		return event;
	}

	fireEJEvent(element: Element, name: string, data? = {}) {
		return fireEvent(element, `${constants.eventPrefix}${name}`, data);
	}
}
